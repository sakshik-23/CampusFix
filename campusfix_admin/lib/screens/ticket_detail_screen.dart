import 'package:flutter/material.dart';
import '../models/ticket_model.dart';
import '../services/firebase_service.dart';
import '../theme/app_colors.dart';
import '../widgets/status_badge_widget.dart';
import 'package:url_launcher/url_launcher.dart';

class TicketDetailScreen extends StatefulWidget {
  final CampusTicket ticket;
  const TicketDetailScreen({Key? key, required this.ticket}) : super(key: key);

  @override
  State<TicketDetailScreen> createState() => _TicketDetailScreenState();
}

class _TicketDetailScreenState extends State<TicketDetailScreen> {
  late String _status;
  String _notes = '';
  late double _itemLat;
  late double _itemLng;
  String _floor = '';

  @override
  void initState() {
    super.initState();
    _status = widget.ticket.status;
    _notes = widget.ticket.adminNotes;
    _itemLat = widget.ticket.latitude;
    _itemLng = widget.ticket.longitude;
    _floor = widget.ticket.itemSnapshot['floor']?.toString() ?? '';
    _loadLiveAssetDetails();
  }

  Future<void> _loadLiveAssetDetails() async {
    try {
      final asset = await FirebaseService.getAssetById(widget.ticket.itemId);
      if (asset != null && mounted) {
        setState(() {
          _itemLat = asset.latitude;
          _itemLng = asset.longitude;
          if (asset.floor.isNotEmpty) _floor = asset.floor;
        });
      }
    } catch (_) {}
  }

  void _openGoogleMaps() async {
    final lat = _itemLat;
    final lng = _itemLng;
    final assetName = widget.ticket.itemSnapshot['itemName'] ?? widget.ticket.itemId;
    final room = widget.ticket.itemSnapshot['room'] ?? '';
    final encodedLabel = Uri.encodeComponent('$assetName ${room.isNotEmpty ? "($room)" : ""}');

    // 1. Universal Google Maps directions URL (opens native Google Maps app when mode is externalApplication)
    final mapsDirUri = Uri.parse('https://www.google.com/maps/dir/?api=1&destination=$lat,$lng');
    // 2. Google Maps turn-by-turn navigation intent
    final googleNavUri = Uri.parse('google.navigation:q=$lat,$lng&mode=d');
    // 3. Geo intent with label
    final geoUri = Uri.parse('geo:$lat,$lng?q=$lat,$lng($encodedLabel)');

    bool success = false;

    // Try Google Maps URL with externalApplication (standard on Android)
    try {
      success = await launchUrl(mapsDirUri, mode: LaunchMode.externalApplication);
      if (success) return;
    } catch (_) {}

    // Try Google navigation intent
    try {
      success = await launchUrl(googleNavUri, mode: LaunchMode.externalApplication);
      if (success) return;
    } catch (_) {}

    // Try Geo intent
    try {
      success = await launchUrl(geoUri, mode: LaunchMode.externalApplication);
      if (success) return;
    } catch (_) {}

    // Fallback to platform default
    try {
      success = await launchUrl(mapsDirUri, mode: LaunchMode.platformDefault);
      if (success) return;
    } catch (_) {}

    if (!success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Could not open map navigation. Please ensure Google Maps or a web browser is installed.'),
          backgroundColor: AppColors.danger,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  void _callPhone(String phone) async {
    final clean = phone.replaceAll(RegExp(r'\s+'), '');
    final uri = Uri.parse('tel:$clean');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  void _showCloseModal() {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.border),
        ),
        title: const Text(
          'Resolve Incident Ticket',
          style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700, fontSize: 16),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF2F2),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFFFCA5A5)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.info_outline_rounded, color: Color(0xFFDC2626), size: 16),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Resolving this ticket will permanently remove and delete it from the system.',
                      style: TextStyle(color: Color(0xFFB91C1C), fontSize: 11.5, fontWeight: FontWeight.w500),
                    ),
                  ),
                ],
              ),
            ),
            const Text(
              'Enter resolution notes (optional):',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: controller,
              style: const TextStyle(color: AppColors.textPrimary, fontSize: 13.5),
              maxLines: 3,
              decoration: InputDecoration(
                hintText: 'e.g. Replaced projector power supply and verified HDMI signal.',
                hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 12.5),
                filled: true,
                fillColor: AppColors.cardSubtle,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: AppColors.borderLight),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: AppColors.borderLight),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: AppColors.primary),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel', style: TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.w600)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.success,
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () async {
              Navigator.of(ctx).pop();
              final remarks = controller.text.isNotEmpty ? controller.text : 'Resolved on-site by administrator.';
              try {
                await FirebaseService.resolveTicket(widget.ticket.ticketId, remarks);
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Ticket ${widget.ticket.ticketId} resolved and deleted from system'),
                    backgroundColor: AppColors.success,
                    behavior: SnackBarBehavior.floating,
                  ),
                );
                Navigator.of(context).pop();
              } catch (e) {
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Error resolving ticket: $e'),
                    backgroundColor: AppColors.danger,
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              }
            },
            child: const Text('Confirm Resolution & Delete', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isOpen = _status.toUpperCase() == 'OPEN';
    final snapshot = widget.ticket.itemSnapshot;
    final building = snapshot['building'] ?? '';
    final room = snapshot['room'] ?? '';
    final assetName = snapshot['itemName'] ?? widget.ticket.itemId;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        iconTheme: const IconThemeData(color: AppColors.textPrimary),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(color: AppColors.border, height: 1),
        ),
        title: Text(
          widget.ticket.ticketId,
          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16, fontFamily: 'monospace', color: AppColors.textPrimary),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Top Status Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.border),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.02),
                  blurRadius: 4,
                  offset: const Offset(0, 1),
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('TICKET STATUS', style: TextStyle(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                    const SizedBox(height: 4),
                    Text(
                      isOpen ? 'Awaiting Maintenance' : 'Resolved & Closed',
                      style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700, fontSize: 14),
                    ),
                  ],
                ),
                StatusBadgeWidget(status: _status, isLarge: true),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Problem Description
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.border),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.02),
                  blurRadius: 4,
                  offset: const Offset(0, 1),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        widget.ticket.ticketType,
                        style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.w700, fontSize: 11),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                const Text('REPORTED PROBLEM', style: TextStyle(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                const SizedBox(height: 6),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.cardSubtle,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppColors.borderLight),
                  ),
                  child: Text(
                    widget.ticket.description,
                    style: const TextStyle(color: AppColors.textPrimary, fontSize: 13.5, height: 1.4),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Asset Location Snapshot
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.border),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.02),
                  blurRadius: 4,
                  offset: const Offset(0, 1),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('ATTACHED ASSET', style: TextStyle(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                const SizedBox(height: 10),
                _buildInfoRow('Asset Name', assetName),
                _buildInfoRow('Asset ID', widget.ticket.itemId),
                if (building.isNotEmpty) _buildInfoRow('Building', building),
                if (_floor.isNotEmpty) _buildInfoRow('Floor', _floor),
                if (room.isNotEmpty) _buildInfoRow('Room / Hall', room),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Asset Location & GPS Navigation Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.border),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.02),
                  blurRadius: 4,
                  offset: const Offset(0, 1),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'ITEM GPS LOCATION',
                      style: TextStyle(
                        color: AppColors.textMuted,
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.8,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981).withOpacity(0.12),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.location_on_rounded, size: 11, color: Color(0xFF10B981)),
                          SizedBox(width: 3),
                          Text(
                            'GPS Fixed',
                            style: TextStyle(color: Color(0xFF10B981), fontSize: 10, fontWeight: FontWeight.w700),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                _buildInfoRow('Latitude', _itemLat.toStringAsFixed(6)),
                _buildInfoRow('Longitude', _itemLng.toStringAsFixed(6)),
                const SizedBox(height: 14),
                SizedBox(
                  width: double.infinity,
                  height: 46,
                  child: ElevatedButton.icon(
                    onPressed: _openGoogleMaps,
                    icon: const Icon(Icons.navigation_rounded, size: 18),
                    label: const Text(
                      'Navigate in Google Maps',
                      style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0F9D58), // Google Maps Green
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Reporter Phone Contact
          if (widget.ticket.phoneNumber.isNotEmpty)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.border),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.02),
                    blurRadius: 4,
                    offset: const Offset(0, 1),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.phone_outlined, color: AppColors.primary, size: 18),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('REPORTER CONTACT', style: TextStyle(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                        const SizedBox(height: 2),
                        Text(widget.ticket.phoneNumber, style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700, fontSize: 13.5)),
                      ],
                    ),
                  ),
                  ElevatedButton.icon(
                    onPressed: () => _callPhone(widget.ticket.phoneNumber),
                    icon: const Icon(Icons.call, size: 14),
                    label: const Text('Call', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                  ),
                ],
              ),
            ),

          if (_notes.isNotEmpty) ...[
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.success.withOpacity(0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('RESOLUTION REMARKS', style: TextStyle(color: AppColors.success, fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                  const SizedBox(height: 6),
                  Text(_notes, style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, height: 1.3)),
                ],
              ),
            ),
          ],

          const SizedBox(height: 24),

          // Action Button
          if (isOpen)
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                onPressed: _showCloseModal,
                icon: const Icon(Icons.check_circle_outline_rounded, size: 18),
                label: const Text('Resolve & Close Incident', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.success,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12.5)),
          Text(value, style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w600, fontSize: 12.5)),
        ],
      ),
    );
  }
}
