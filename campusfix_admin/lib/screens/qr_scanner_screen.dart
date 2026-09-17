import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:permission_handler/permission_handler.dart';
import '../models/asset_model.dart';
import '../services/firebase_service.dart';
import 'asset_detail_screen.dart';

class QRScannerScreen extends StatefulWidget {
  const QRScannerScreen({Key? key}) : super(key: key);

  @override
  State<QRScannerScreen> createState() => _QRScannerScreenState();
}

class _QRScannerScreenState extends State<QRScannerScreen> with WidgetsBindingObserver {
  late MobileScannerController _cameraController;
  bool _hasScanned = false;
  bool _permissionGranted = false;
  bool _checkingPermission = true;
  String _permissionMessage = '';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _cameraController = MobileScannerController(
      detectionSpeed: DetectionSpeed.noDuplicates,
      facing: CameraFacing.back,
      torchEnabled: false,
    );
    _requestCameraPermission();
  }

  Future<void> _requestCameraPermission() async {
    if (kIsWeb) {
      // On web, browser prompts for camera when MobileScanner initializes
      if (mounted) {
        setState(() {
          _permissionGranted = true;
          _checkingPermission = false;
        });
      }
      return;
    }

    setState(() {
      _checkingPermission = true;
      _permissionMessage = '';
    });

    try {
      final status = await Permission.camera.status;
      if (status.isGranted) {
        if (mounted) {
          setState(() {
            _permissionGranted = true;
            _checkingPermission = false;
          });
        }
        return;
      }

      final requested = await Permission.camera.request();
      if (mounted) {
        setState(() {
          _checkingPermission = false;
          _permissionGranted = requested.isGranted;
          if (requested.isPermanentlyDenied) {
            _permissionMessage = 'Camera permission is permanently denied. Tap below to open Settings and enable Camera access.';
          } else if (!requested.isGranted) {
            _permissionMessage = 'Camera permission was not granted. Tap below to grant permission or enter the Asset ID manually.';
          }
        });
      }
    } catch (e) {
      debugPrint("Camera permission check error: $e");
      if (mounted) {
        setState(() {
          _checkingPermission = false;
          // Fall back to attempting camera initialization in case permission_handler is unavailable
          _permissionGranted = true;
        });
      }
    }
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed && !_permissionGranted) {
      _requestCameraPermission();
    }
  }

  void _handleScannedCode(String rawValue) async {
    if (_hasScanned) return;
    _hasScanned = true;
    _cameraController.stop();

    // Extract Asset ID from URL or raw text
    String assetId = rawValue.trim();
    final match = RegExp(r'AST-\d+').firstMatch(rawValue);
    if (match != null) {
      assetId = match.group(0)!;
    }

    // Fetch live asset from Firestore or create fallback
    CampusAsset? liveAsset;
    try {
      liveAsset = await FirebaseService.getAssetById(assetId);
    } catch (e) {
      debugPrint("Error fetching scanned asset: $e");
    }

    final targetAsset = liveAsset ??
        CampusAsset(
          itemId: assetId,
          itemName: 'Asset ($assetId)',
          itemType: 'Equipment',
          description: 'Physical asset scanned via QR.',
          building: 'Campus Building',
          floor: '1',
          room: 'Lab',
          latitude: 18.520430,
          longitude: 73.856744,
          status: 'ACTIVE',
          qrUrl: rawValue.startsWith('http') ? rawValue : 'https://campusfix1.vercel.app/report/$assetId',
        );

    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (_) => AssetDetailScreen(asset: targetAsset),
      ),
    );
  }

  void _showManualLookupDialog() {
    final controller = TextEditingController(text: 'AST-000001');
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF0D111A),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: const BorderSide(color: Color(0xFF1E2638)),
        ),
        title: const Text(
          'Manual Asset Lookup',
          style: TextStyle(color: Color(0xFFF8FAFC), fontWeight: FontWeight.w700, fontSize: 16),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Enter an Asset ID (e.g. AST-000001) or paste the QR URL:',
              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12.5),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: controller,
              style: const TextStyle(color: Colors.white, fontSize: 14, fontFamily: 'monospace'),
              decoration: InputDecoration(
                hintText: 'AST-000001',
                hintStyle: const TextStyle(color: Color(0xFF475569)),
                filled: true,
                fillColor: const Color(0xFF07090E),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Color(0xFF1E2638))),
                enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Color(0xFF1E2638))),
                focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Color(0xFF0284C7))),
                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel', style: TextStyle(color: Color(0xFF64748B))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0284C7),
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () {
              Navigator.of(ctx).pop();
              if (controller.text.trim().isNotEmpty) {
                _handleScannedCode(controller.text.trim());
              }
            },
            child: const Text('Look Up Asset', style: TextStyle(fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _cameraController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF07090E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0D111A),
        elevation: 0,
        title: const Text(
          'Scan Asset QR Code',
          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: Color(0xFFF8FAFC)),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.keyboard_outlined, color: Color(0xFF38BDF8), size: 22),
            tooltip: 'Manual Lookup',
            onPressed: _showManualLookupDialog,
          ),
          if (_permissionGranted) ...[
            IconButton(
              icon: const Icon(Icons.flash_on_rounded, color: Color(0xFF94A3B8), size: 20),
              onPressed: () => _cameraController.toggleTorch(),
            ),
            IconButton(
              icon: const Icon(Icons.cameraswitch_rounded, color: Color(0xFF94A3B8), size: 20),
              onPressed: () => _cameraController.switchCamera(),
            ),
          ],
        ],
      ),
      body: _checkingPermission
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xFF0284C7), strokeWidth: 2),
            )
          : !_permissionGranted
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    child: Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0D111A),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFF1E2638)),
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: const Color(0xFFEF4444).withValues(alpha: 0.12),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.camera_alt_outlined, color: Color(0xFFEF4444), size: 32),
                          ),
                          const SizedBox(height: 16),
                          const Text(
                            'Camera Access Required',
                            style: TextStyle(color: Color(0xFFF8FAFC), fontWeight: FontWeight.w800, fontSize: 16),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            _permissionMessage.isNotEmpty
                                ? _permissionMessage
                                : 'Please grant camera access to scan physical QR labels on campus equipment.',
                            textAlign: TextAlign.center,
                            style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12.5, height: 1.4),
                          ),
                          const SizedBox(height: 20),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: () async {
                                final status = await Permission.camera.status;
                                if (status.isPermanentlyDenied) {
                                  openAppSettings();
                                } else {
                                  _requestCameraPermission();
                                }
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF0284C7),
                                foregroundColor: Colors.white,
                                elevation: 0,
                                padding: const EdgeInsets.symmetric(vertical: 12),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                              child: const Text('Grant Camera Permission', style: TextStyle(fontWeight: FontWeight.w700)),
                            ),
                          ),
                          const SizedBox(height: 10),
                          SizedBox(
                            width: double.infinity,
                            child: TextButton.icon(
                              onPressed: _showManualLookupDialog,
                              icon: const Icon(Icons.keyboard_outlined, size: 16, color: Color(0xFF38BDF8)),
                              label: const Text('Or Enter Asset ID Manually', style: TextStyle(color: Color(0xFF38BDF8), fontWeight: FontWeight.w600)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                )
              : Stack(
                  alignment: Alignment.center,
                  children: [
                    MobileScanner(
                      controller: _cameraController,
                      onDetect: (capture) {
                        for (final barcode in capture.barcodes) {
                          final String? rawValue = barcode.rawValue;
                          if (rawValue != null && rawValue.isNotEmpty) {
                            _handleScannedCode(rawValue);
                            break;
                          }
                        }
                      },
                      errorBuilder: (context, error, child) {
                        return Center(
                          child: Padding(
                            padding: const EdgeInsets.all(24.0),
                            child: Container(
                              padding: const EdgeInsets.all(20),
                              decoration: BoxDecoration(
                                color: const Color(0xFF0D111A),
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(color: const Color(0xFF1E2638)),
                              ),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.error_outline_rounded, color: Color(0xFFEF4444), size: 30),
                                  const SizedBox(height: 10),
                                  const Text('Camera Error', style: TextStyle(color: Color(0xFFF8FAFC), fontWeight: FontWeight.w700)),
                                  const SizedBox(height: 6),
                                  Text(
                                    error.errorDetails?.message ?? error.errorCode.name,
                                    textAlign: TextAlign.center,
                                    style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                                  ),
                                  const SizedBox(height: 16),
                                  ElevatedButton(
                                    onPressed: _showManualLookupDialog,
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0xFF0284C7),
                                      foregroundColor: Colors.white,
                                    ),
                                    child: const Text('Enter Asset ID Manually'),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                    // High-contrast viewfinder box
                    Container(
                      width: 240,
                      height: 240,
                      decoration: BoxDecoration(
                        border: Border.all(color: const Color(0xFF38BDF8), width: 2.5),
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF0284C7).withValues(alpha: 0.2),
                            blurRadius: 20,
                            spreadRadius: 2,
                          )
                        ],
                      ),
                    ),
                    Positioned(
                      bottom: 36,
                      child: Column(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              color: const Color(0xFF0D111A).withValues(alpha: 0.9),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: const Color(0xFF1E2638)),
                            ),
                            child: const Text(
                              'Align QR label within square',
                              style: TextStyle(color: Color(0xFFF8FAFC), fontSize: 12.5, fontWeight: FontWeight.w600),
                            ),
                          ),
                          const SizedBox(height: 10),
                          InkWell(
                            onTap: _showManualLookupDialog,
                            child: const Padding(
                              padding: EdgeInsets.all(4.0),
                              child: Text(
                                'Manual ID Entry',
                                style: TextStyle(color: Color(0xFF38BDF8), fontSize: 12, fontWeight: FontWeight.w700, decoration: TextDecoration.underline),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
    );
  }
}
