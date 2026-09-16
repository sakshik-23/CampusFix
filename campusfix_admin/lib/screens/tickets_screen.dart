import 'package:flutter/material.dart';
import '../models/ticket_model.dart';
import '../services/firebase_service.dart';
import '../widgets/status_badge_widget.dart';
import 'ticket_detail_screen.dart';

class TicketsScreen extends StatefulWidget {
  const TicketsScreen({Key? key}) : super(key: key);

  @override
  State<TicketsScreen> createState() => _TicketsScreenState();
}

class _TicketsScreenState extends State<TicketsScreen> {
  String _filter = 'ALL';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0F19),
      appBar: AppBar(
        backgroundColor: const Color(0xFF111827),
        elevation: 0,
        title: const Text('Maintenance Tickets', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
      ),
      body: StreamBuilder<List<CampusTicket>>(
        stream: FirebaseService.streamTickets(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting && !snapshot.hasData) {
            return const Center(child: CircularProgressIndicator(color: Color(0xFF3B82F6)));
          }

          if (snapshot.hasError) {
            return Center(
              child: Text('Error loading tickets: ${snapshot.error}', style: const TextStyle(color: Color(0xFFEF4444))),
            );
          }

          final allTickets = snapshot.data ?? [];
          final openCount = allTickets.where((t) => t.status.toUpperCase() == 'OPEN').length;
          final closedCount = allTickets.where((t) => t.status.toUpperCase() == 'CLOSED').length;

          final filtered = allTickets.where((t) {
            if (_filter == 'OPEN') return t.status.toUpperCase() == 'OPEN';
            if (_filter == 'CLOSED') return t.status.toUpperCase() == 'CLOSED';
            return true;
          }).toList();

          return Column(
            children: [
              // Filter Chips
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                child: Row(
                  children: [
                    _buildFilterChip('ALL', 'All (${allTickets.length})'),
                    const SizedBox(width: 8),
                    _buildFilterChip('OPEN', '🔴 Open ($openCount)'),
                    const SizedBox(width: 8),
                    _buildFilterChip('CLOSED', '🟢 Closed ($closedCount)'),
                  ],
                ),
              ),
              Expanded(
                child: filtered.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: const [
                            Icon(Icons.confirmation_num_outlined, size: 48, color: Color(0xFF334155)),
                            SizedBox(height: 12),
                            Text('No tickets found', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 14)),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(12),
                        itemCount: filtered.length,
                        itemBuilder: (context, index) {
                          final ticket = filtered[index];
                          final room = ticket.itemSnapshot['room'] ?? '';
                          final building = ticket.itemSnapshot['building'] ?? '';

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
                                  '${ticket.itemSnapshot['itemName'] ?? ticket.itemId} • ${ticket.ticketType}',
                                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 14),
                                ),
                                if (room.isNotEmpty || building.isNotEmpty) ...[
                                  const SizedBox(height: 4),
                                  Text(
                                    'Room $room ($building)',
                                    style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                                  ),
                                ],
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
          );
        },
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
