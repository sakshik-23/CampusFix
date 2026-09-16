import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../models/asset_model.dart';
import 'asset_detail_screen.dart';

class QRScannerScreen extends StatefulWidget {
  const QRScannerScreen({Key? key}) : super(key: key);

  @override
  State<QRScannerScreen> createState() => _QRScannerScreenState();
}

class _QRScannerScreenState extends State<QRScannerScreen> {
  final MobileScannerController _cameraController = MobileScannerController();
  bool _hasScanned = false;

  void _onDetect(BarcodeCapture capture) {
    if (_hasScanned) return;
    final List<Barcode> barcodes = capture.barcodes;
    for (final barcode in barcodes) {
      final String? rawValue = barcode.rawValue;
      if (rawValue != null) {
        _hasScanned = true;
        _cameraController.stop();

        // Extract Asset ID from URL or raw text
        String assetId = 'AST-000001';
        final match = RegExp(r'AST-\d+').firstMatch(rawValue);
        if (match != null) {
          assetId = match.group(0)!;
        }

        Navigator.of(context).pushReplacement(
          MaterialPageRoute(
            builder: (_) => AssetDetailScreen(
              asset: CampusAsset(
                itemId: assetId,
                itemName: 'Scanned Asset ($assetId)',
                itemType: 'Equipment',
                description: 'Physical asset scanned via camera.',
                building: 'Main Campus',
                floor: '1',
                room: 'Lab',
                latitude: 18.520430,
                longitude: 73.856744,
                status: 'ACTIVE',
                qrUrl: rawValue,
              ),
            ),
          ),
        );
        break;
      }
    }
  }

  @override
  void dispose() {
    _cameraController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Scan Asset QR Code', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        actions: [
          IconButton(
            icon: const Icon(Icons.flash_on),
            onPressed: () => _cameraController.toggleTorch(),
          ),
          IconButton(
            icon: const Icon(Icons.cameraswitch),
            onPressed: () => _cameraController.switchCamera(),
          ),
        ],
      ),
      body: Stack(
        alignment: Alignment.center,
        children: [
          MobileScanner(
            controller: _cameraController,
            onDetect: _onDetect,
          ),
          // Viewfinder overlay
          Container(
            width: 240,
            height: 240,
            decoration: BoxDecoration(
              border: Border.all(color: const Color(0xFF3B82F6), width: 3),
              borderRadius: BorderRadius.circular(16),
            ),
          ),
          Positioned(
            bottom: 40,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.7),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text(
                'Point camera at asset QR label',
                style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
