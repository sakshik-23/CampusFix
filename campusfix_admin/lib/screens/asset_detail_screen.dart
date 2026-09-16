import 'package:flutter/material.dart';
import '../models/asset_model.dart';
import '../services/location_service.dart';
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
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('GPS Updated: ${_lat.toStringAsFixed(6)}, ${_lng.toStringAsFixed(6)}'),
          backgroundColor: const Color(0xFF10B981),
        ),
      );
    } else {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Could not fetch GPS. Please check location permissions.'),
          backgroundColor: Color(0xFFEF4444),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0F19),
      appBar: AppBar(
        backgroundColor: const Color(0xFF111827),
        elevation: 0,
        title: Text(widget.asset.itemId, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, fontFamily: 'monospace')),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Header Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF111827),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF1E293B)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(widget.asset.itemName, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(color: const Color(0x2610B981), borderRadius: BorderRadius.circular(20)),
                      child: Text(widget.asset.status, style: const TextStyle(color: Color(0xFF10B981), fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text('${widget.asset.room} • ${widget.asset.building}', style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13)),
                const SizedBox(height: 12),
                Text(widget.asset.description, style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 13, height: 1.4)),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // GPS Location Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF111827),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF1E293B)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('PHYSICAL LOCATION (GPS)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
                const SizedBox(height: 8),
                Text('Latitude: $_lat', style: const TextStyle(color: Colors.white, fontFamily: 'monospace', fontSize: 13)),
                const SizedBox(height: 2),
                Text('Longitude: $_lng', style: const TextStyle(color: Colors.white, fontFamily: 'monospace', fontSize: 13)),
                const SizedBox(height: 14),

                SizedBox(
                  width: double.infinity,
                  height: 42,
                  child: ElevatedButton.icon(
                    onPressed: _updatingGps ? null : _updateGps,
                    icon: _updatingGps
                        ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : const Icon(Icons.my_location, size: 16, color: Colors.white),
                    label: const Text('Tag Current GPS Location', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF3B82F6),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // QR Code Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF111827),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF1E293B)),
            ),
            child: Column(
              children: [
                const Text('ATTACHED QR CODE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(8)),
                  child: QrImageView(
                    data: widget.asset.qrUrl,
                    version: QrVersions.auto,
                    size: 160.0,
                  ),
                ),
                const SizedBox(height: 8),
                Text(widget.asset.itemId, style: const TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.bold, color: Colors.white)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
