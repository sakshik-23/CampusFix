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
        backgroundColor: const Color(0xFF111827),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: const BorderSide(color: Color(0xFF1E293B))),
        title: const Text('Resolve Ticket', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Enter maintenance remarks / action taken:', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13)),
            const SizedBox(height: 10),
            TextField(
              controller: controller,
              style: const TextStyle(color: Colors.white),
              maxLines: 3,
              decoration: InputDecoration(
                hintText: 'e.g. Fixed electrical wiring and tested.',
                hintStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
                filled: true,
                fillColor: const Color(0xFF0B0F19),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Color(0xFF1E293B))),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel', style: TextStyle(color: Color(0xFF94A3B8))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981)),
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
                  const SnackBar(content: Text('Ticket resolved & synced to Cloud! 🟢'), backgroundColor: Color(0xFF10B981)),
                );
              } catch (e) {
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Cloud sync error: $e'), backgroundColor: const Color(0xFFEF4444)),
                );
              }
            },
            child: const Text('Close Ticket 🟢', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isOpen = _status == 'OPEN';

    return Scaffold(
      backgroundColor: const Color(0xFF0B0F19),
      appBar: AppBar(
        backgroundColor: const Color(0xFF111827),
        elevation: 0,
        title: Text(widget.ticket.ticketId, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, fontFamily: 'monospace')),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Top Status Card
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
                    Text(widget.ticket.ticketType, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white)),
                    StatusBadgeWidget(status: _status, isLarge: true),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  'Asset: ${widget.ticket.itemSnapshot['itemName'] ?? 'Asset'} (${widget.ticket.itemId})',
                  style: const TextStyle(color: Color(0xFF60A5FA), fontWeight: FontWeight.w600, fontSize: 14),
                ),
                const SizedBox(height: 4),
                Text(
                  'Location: Room ${widget.ticket.itemSnapshot['room']} • Floor ${widget.ticket.itemSnapshot['floor']} • ${widget.ticket.itemSnapshot['building']}',
                  style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Problem Description
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
                const Text('REPORTED PROBLEM', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
                const SizedBox(height: 8),
                Text('"${widget.ticket.description}"', style: const TextStyle(color: Colors.white, fontSize: 14, height: 1.4)),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Reporter Phone
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF111827),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF1E293B)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('REPORTER PHONE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
                    const SizedBox(height: 4),
                    Text(widget.ticket.phoneNumber, style: const TextStyle(color: Colors.white, fontFamily: 'monospace', fontWeight: FontWeight.bold, fontSize: 15)),
                  ],
                ),
                IconButton(
                  onPressed: () => _callPhone(widget.ticket.phoneNumber),
                  icon: const Icon(Icons.phone, color: Color(0xFF3B82F6)),
                  style: IconButton.styleFrom(backgroundColor: const Color(0x263B82F6)),
                )
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Resolution Remarks if Closed
          if (!isOpen && _notes.isNotEmpty)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0x1A10B981),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF10B981).withOpacity(0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('RESOLUTION SUMMARY', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF10B981))),
                  const SizedBox(height: 6),
                  Text(_notes, style: const TextStyle(color: Colors.white, fontSize: 13)),
                ],
              ),
            ),
          const SizedBox(height: 24),

          // Action Button: Close Ticket (PRD FR-36)
          if (isOpen)
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton.icon(
                onPressed: _showCloseModal,
                icon: const Icon(Icons.check_circle_outline, color: Colors.white),
                label: const Text('Resolve & Close Ticket', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF10B981),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
