import 'package:flutter/material.dart';
import '../models/asset_model.dart';
import '../services/location_service.dart';
import '../services/firebase_service.dart';
import 'package:qr_flutter/qr_flutter.dart';

class AssetDetailScreen extends StatefulWidget {
  final CampusAsset asset;
  const AssetDetailScreen({Key? key, required this.asset}) : super(key: key);

  @override
  State<AssetDetailScreen> createState() => _AssetDetailScreenState();
}

class _AssetDetailScreenState extends State<AssetDetailScreen> {
  late double _lat;
  late double _lng;
  bool _updatingGps = false;

  @override
  void initState() {
    super.initState();
    _lat = widget.asset.latitude;
    _lng = widget.asset.longitude;
  }

  Future<void> _updateGps() async {
    setState(() => _updatingGps = true);
    final pos = await LocationService.getCurrentLocation();
    setState(() => _updatingGps = false);

    if (pos != null) {
      setState(() {
        _lat = pos.latitude;
        _lng = pos.longitude;
      });
      try {
        await FirebaseService.updateAssetLocation(widget.asset.itemId, pos.latitude, pos.longitude);
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('GPS updated to ${_lat.toStringAsFixed(6)}, ${_lng.toStringAsFixed(6)}'),
            backgroundColor: const Color(0xFF10B981),
            behavior: SnackBarBehavior.floating,
          ),
        );
      } catch (e) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to update GPS: $e'),
            backgroundColor: const Color(0xFFEF4444),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } else {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Could not acquire GPS fix. Please verify location permissions.'),
          backgroundColor: Color(0xFFEF4444),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF07090E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0D111A),
        elevation: 0,
        title: Text(
          widget.asset.itemId,
          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16, fontFamily: 'monospace', color: Color(0xFFF8FAFC)),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Header Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: const Color(0xFF0D111A),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFF1E2638)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0284C7).withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        widget.asset.itemType,
                        style: const TextStyle(color: Color(0xFF38BDF8), fontWeight: FontWeight.w700, fontSize: 11),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981).withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.3)),
                      ),
                      child: Text(
                        widget.asset.status.toUpperCase(),
                        style: const TextStyle(color: Color(0xFF34D399), fontWeight: FontWeight.w700, fontSize: 10, letterSpacing: 0.5),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  widget.asset.itemName,
                  style: const TextStyle(color: Color(0xFFF8FAFC), fontWeight: FontWeight.w800, fontSize: 18, letterSpacing: -0.3),
                ),
                if (widget.asset.description.isNotEmpty) ...[
                  const SizedBox(height: 6),
                  Text(
                    widget.asset.description,
                    style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13, height: 1.4),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Location & Hardware Details Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF0D111A),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFF1E2638)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('SPECIFICATIONS & PLACEMENT', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                const SizedBox(height: 10),
                _buildInfoRow('Building', widget.asset.building),
                _buildInfoRow('Floor', widget.asset.floor),
                _buildInfoRow('Room / Lab', widget.asset.room),
                if (widget.asset.manufacturer.isNotEmpty) _buildInfoRow('Manufacturer', widget.asset.manufacturer),
                if (widget.asset.model.isNotEmpty) _buildInfoRow('Model', widget.asset.model),
                if (widget.asset.serialNumber.isNotEmpty) _buildInfoRow('Serial Number', widget.asset.serialNumber),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // GPS Pinning Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF0D111A),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFF1E2638)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('GEOLOCATION PIN', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                    ElevatedButton.icon(
                      onPressed: _updatingGps ? null : _updateGps,
                      icon: _updatingGps
                          ? const SizedBox(width: 12, height: 12, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                          : const Icon(Icons.my_location_rounded, size: 14),
                      label: const Text('Update GPS', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0284C7),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF07090E),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: const Color(0xFF161D2B)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('LATITUDE', style: TextStyle(color: Color(0xFF64748B), fontSize: 9, fontWeight: FontWeight.w700)),
                            const SizedBox(height: 2),
                            Text(
                              _lat.toStringAsFixed(6),
                              style: const TextStyle(color: Color(0xFF38BDF8), fontFamily: 'monospace', fontWeight: FontWeight.w700, fontSize: 13),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF07090E),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: const Color(0xFF161D2B)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('LONGITUDE', style: TextStyle(color: Color(0xFF64748B), fontSize: 9, fontWeight: FontWeight.w700)),
                            const SizedBox(height: 2),
                            Text(
                              _lng.toStringAsFixed(6),
                              style: const TextStyle(color: Color(0xFF38BDF8), fontFamily: 'monospace', fontWeight: FontWeight.w700, fontSize: 13),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // QR Code Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFF0D111A),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFF1E2638)),
            ),
            child: Column(
              children: [
                const Text('PUBLIC ISSUE REPORTING QR', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: QrImageView(
                    data: widget.asset.qrUrl.isNotEmpty
                        ? widget.asset.qrUrl
                        : 'https://campusfix-360dd.web.app/report/${widget.asset.itemId}',
                    version: QrVersions.auto,
                    size: 160.0,
                  ),
                ),
                const SizedBox(height: 14),
                Text(
                  widget.asset.qrUrl.isNotEmpty
                      ? widget.asset.qrUrl
                      : 'https://campusfix-360dd.web.app/report/${widget.asset.itemId}',
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11, fontFamily: 'monospace'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    if (value.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Color(0xFF64748B), fontSize: 12.5)),
          Text(value, style: const TextStyle(color: Color(0xFFF8FAFC), fontWeight: FontWeight.w600, fontSize: 12.5)),
        ],
      ),
    );
  }
}
