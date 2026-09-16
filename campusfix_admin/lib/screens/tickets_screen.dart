import 'package:flutter/material.dart';
import '../models/ticket_model.dart';
import '../widgets/status_badge_widget.dart';
import 'ticket_detail_screen.dart';

class TicketsScreen extends StatefulWidget {
  const TicketsScreen({Key? key}) : super(key: key);

  @override
  State<TicketsScreen> createState() => _TicketsScreenState();
}

class _TicketsScreenState extends State<TicketsScreen> {
  final List<CampusTicket> _sampleTickets = [
    CampusTicket(
      ticketId: 'TKT-2026-000001',
      itemId: 'AST-000001',
      ticketType: 'Not Working',
      description: 'The projector lamp turns on and fan spins at high speed, but no display or HDMI signal is projected on the screen.',
      phoneNumber: '+919876543210',
      status: 'OPEN',
      latitude: 18.520430,
      longitude: 73.856744,
      itemSnapshot: {
        'itemName': 'Projector #01',
        'itemType': 'Projector',
        'building': 'Main Academic Block',
        'floor': '2',
        'room': 'A-203'
      },
    ),
    CampusTicket(
      ticketId: 'TKT-2026-000002',
      itemId: 'AST-000003',
      ticketType: 'Performance Problem',
      description: 'Ceiling fan making loud grinding noise at speed 4 and 5.',
      phoneNumber: '+919123456780',
      status: 'CLOSED',
      latitude: 18.521150,
      longitude: 73.857320,
      itemSnapshot: {
        'itemName': 'Ceiling Fan #04',
        'itemType': 'Fan',
        'building': 'Science & CS Block',
        'floor': '3',
        'room': 'B-301'
      },
      adminNotes: 'Replaced faulty ball bearing and tightened screws.',
    ),
  ];

  String _filter = 'ALL';

  @override
  Widget build(BuildContext context) {
    final filtered = _sampleTickets.where((t) {
      if (_filter == 'OPEN') return t.status == 'OPEN';
      if (_filter == 'CLOSED') return t.status == 'CLOSED';
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFF0B0F19),
      appBar: AppBar(
        backgroundColor: const Color(0xFF111827),
        elevation: 0,
        title: const Text('Maintenance Tickets', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
      ),
      body: Column(
        children: [
          // Filter Chips
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: Row(
              children: [
                _buildFilterChip('ALL', 'All (${_sampleTickets.length})'),
                const SizedBox(width: 8),
                _buildFilterChip('OPEN', '🔴 Open'),
                const SizedBox(width: 8),
                _buildFilterChip('CLOSED', '🟢 Closed'),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: filtered.length,
              itemBuilder: (context, index) {
                final ticket = filtered[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(14),
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
                          Text(ticket.ticketId, style: const TextStyle(color: Color(0xFF60A5FA), fontFamily: 'monospace', fontWeight: FontWeight.bold)),
                          StatusBadgeWidget(status: ticket.status),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '${ticket.itemSnapshot['itemName'] ?? 'Asset'} • ${ticket.ticketType}',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 14),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Room ${ticket.itemSnapshot['room']} (${ticket.itemSnapshot['building']})',
                        style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '"${ticket.description}"',
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 12, fontStyle: FontStyle.italic),
                      ),
                      const SizedBox(height: 12),
                      Align(
                        alignment: Alignment.centerRight,
                        child: TextButton.icon(
                          onPressed: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => TicketDetailScreen(ticket: ticket)),
                            );
                          },
                          icon: const Icon(Icons.arrow_forward, size: 14, color: Color(0xFF3B82F6)),
                          label: const Text('View / Resolve', style: TextStyle(color: Color(0xFF3B82F6), fontWeight: FontWeight.bold, fontSize: 12)),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String value, String label) {
    final bool isSelected = _filter == value;
    return GestureDetector(
      onTap: () => setState(() => _filter = value),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF3B82F6) : const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : const Color(0xFF94A3B8),
            fontWeight: FontWeight.bold,
            fontSize: 12,
          ),
        ),
      ),
    );
  }
}
