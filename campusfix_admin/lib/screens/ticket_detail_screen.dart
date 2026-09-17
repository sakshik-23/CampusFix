import 'package:flutter/material.dart';
import '../models/ticket_model.dart';
import '../services/firebase_service.dart';
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

  @override
  void initState() {
    super.initState();
    _status = widget.ticket.status;
    _notes = widget.ticket.adminNotes;
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
        backgroundColor: const Color(0xFF0D111A),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: Color(0xFF1E2638)),
        ),
        title: const Text(
          'Resolve Incident Ticket',
          style: TextStyle(color: Color(0xFFF8FAFC), fontWeight: FontWeight.w700, fontSize: 16),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Enter maintenance action taken / resolution notes:',
              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12.5),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: controller,
              style: const TextStyle(color: Colors.white, fontSize: 13.5),
              maxLines: 3,
              decoration: InputDecoration(
                hintText: 'e.g. Replaced projector power supply and verified HDMI signal.',
                hintStyle: const TextStyle(color: Color(0xFF475569), fontSize: 12.5),
                filled: true,
                fillColor: const Color(0xFF07090E),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: Color(0xFF1E2638)),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: Color(0xFF1E2638)),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: Color(0xFF10B981)),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel', style: TextStyle(color: Color(0xFF64748B), fontWeight: FontWeight.w600)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF10B981),
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () async {
              Navigator.of(ctx).pop();
              final remarks = controller.text.isNotEmpty ? controller.text : 'Resolved on-site by administrator.';
              setState(() {
                _status = 'CLOSED';
                _notes = remarks;
              });
              try {
                await FirebaseService.resolveTicket(widget.ticket.ticketId, remarks);
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Ticket marked as resolved'),
                    backgroundColor: Color(0xFF10B981),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              } catch (e) {
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Cloud sync error: $e'),
                    backgroundColor: const Color(0xFFEF4444),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              }
            },
            child: const Text('Confirm Resolution', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
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
      backgroundColor: const Color(0xFF07090E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0D111A),
        elevation: 0,
        title: Text(
          widget.ticket.ticketId,
          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16, fontFamily: 'monospace', color: Color(0xFFF8FAFC)),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Top Status Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF0D111A),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFF1E2638)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('TICKET STATUS', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                    const SizedBox(height: 4),
                    Text(
                      isOpen ? 'Awaiting Maintenance' : 'Resolved & Closed',
                      style: const TextStyle(color: Color(0xFFF8FAFC), fontWeight: FontWeight.w700, fontSize: 14),
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
              color: const Color(0xFF0D111A),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFF1E2638)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0284C7).withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        widget.ticket.ticketType,
                        style: const TextStyle(color: Color(0xFF38BDF8), fontWeight: FontWeight.w700, fontSize: 11),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                const Text('REPORTED PROBLEM', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                const SizedBox(height: 6),
                Text(
                  widget.ticket.description,
                  style: const TextStyle(color: Color(0xFFE2E8F0), fontSize: 13.5, height: 1.4),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Asset Location Snapshot
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
                const Text('ATTACHED ASSET', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                const SizedBox(height: 10),
                _buildInfoRow('Asset Name', assetName),
                _buildInfoRow('Asset ID', widget.ticket.itemId),
                if (building.isNotEmpty) _buildInfoRow('Building', building),
                if (room.isNotEmpty) _buildInfoRow('Room / Hall', room),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Reporter Phone Contact
          if (widget.ticket.phoneNumber.isNotEmpty)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF0D111A),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFF1E2638)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0284C7).withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.phone_outlined, color: Color(0xFF38BDF8), size: 18),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('REPORTER CONTACT', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                        const SizedBox(height: 2),
                        Text(widget.ticket.phoneNumber, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 13.5)),
                      ],
                    ),
                  ),
                  ElevatedButton.icon(
                    onPressed: () => _callPhone(widget.ticket.phoneNumber),
                    icon: const Icon(Icons.call, size: 14),
                    label: const Text('Call', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0284C7),
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
                color: const Color(0xFF0D111A),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('RESOLUTION REMARKS', style: TextStyle(color: Color(0xFF34D399), fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                  const SizedBox(height: 6),
                  Text(_notes, style: const TextStyle(color: Color(0xFFE2E8F0), fontSize: 13, height: 1.3)),
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
                  backgroundColor: const Color(0xFF10B981),
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
          Text(label, style: const TextStyle(color: Color(0xFF64748B), fontSize: 12.5)),
          Text(value, style: const TextStyle(color: Color(0xFFF8FAFC), fontWeight: FontWeight.w600, fontSize: 12.5)),
        ],
      ),
    );
  }
}
