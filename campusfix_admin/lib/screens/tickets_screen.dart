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
      backgroundColor: const Color(0xFF07090E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0D111A),
        elevation: 0,
        title: const Text(
          'Incident Tickets',
          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17, color: Color(0xFFF8FAFC), letterSpacing: -0.3),
        ),
      ),
      body: StreamBuilder<List<CampusTicket>>(
        stream: FirebaseService.streamTickets(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting && !snapshot.hasData) {
            return const Center(child: CircularProgressIndicator(color: Color(0xFF0284C7), strokeWidth: 2));
          }

          if (snapshot.hasError) {
            return Center(
              child: Text('Error loading tickets: ${snapshot.error}', style: const TextStyle(color: Color(0xFFEF4444))),
            );
          }

          final allTickets = snapshot.data ?? [];
          final openCount = allTickets.where((t) => t.status.toUpperCase() == 'OPEN').length;
          final closedCount = allTickets.where((t) => t.status.toUpperCase() == 'CLOSED' || t.status.toUpperCase() == 'RESOLVED').length;

          final filtered = allTickets.where((t) {
            final st = t.status.toUpperCase();
            if (_filter == 'OPEN') return st == 'OPEN';
            if (_filter == 'CLOSED') return st == 'CLOSED' || st == 'RESOLVED';
            return true;
          }).toList();

          return Column(
            children: [
              // Segmented Filter Bar
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                padding: const EdgeInsets.all(3),
                decoration: BoxDecoration(
                  color: const Color(0xFF0D111A),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFF1E2638)),
                ),
                child: Row(
                  children: [
                    _buildSegmentTab('ALL', 'All', '${allTickets.length}'),
                    _buildSegmentTab('OPEN', 'Open', '$openCount'),
                    _buildSegmentTab('CLOSED', 'Resolved', '$closedCount'),
                  ],
                ),
              ),

              Expanded(
                child: filtered.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.confirmation_num_outlined, size: 40, color: Color(0xFF334155)),
                            const SizedBox(height: 12),
                            Text(
                              _filter == 'ALL'
                                  ? 'No incident reports filed yet'
                                  : 'No $_filter tickets found',
                              style: const TextStyle(color: Color(0xFF64748B), fontSize: 13),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                        itemCount: filtered.length,
                        itemBuilder: (context, index) {
                          final ticket = filtered[index];
                          final room = ticket.itemSnapshot['room'] ?? '';
                          final building = ticket.itemSnapshot['building'] ?? '';
                          final assetName = ticket.itemSnapshot['itemName'] ?? ticket.itemId;

                          return Container(
                            margin: const EdgeInsets.only(bottom: 10),
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: const Color(0xFF0D111A),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFF1E2638)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Row(
                                      children: [
                                        Text(
                                          ticket.ticketId,
                                          style: const TextStyle(
                                            color: Color(0xFF38BDF8),
                                            fontFamily: 'monospace',
                                            fontWeight: FontWeight.w700,
                                            fontSize: 12,
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Text(
                                          '•  ${ticket.itemId}',
                                          style: const TextStyle(color: Color(0xFF64748B), fontSize: 11.5),
                                        ),
                                      ],
                                    ),
                                    StatusBadgeWidget(status: ticket.status),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  '$assetName — ${ticket.ticketType}',
                                  style: const TextStyle(
                                    color: Color(0xFFF8FAFC),
                                    fontWeight: FontWeight.w700,
                                    fontSize: 13.5,
                                  ),
                                ),
                                if (room.isNotEmpty || building.isNotEmpty) ...[
                                  const SizedBox(height: 2),
                                  Text(
                                    'Room $room ($building)',
                                    style: const TextStyle(color: Color(0xFF64748B), fontSize: 11.5),
                                  ),
                                ],
                                const SizedBox(height: 8),
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF07090E),
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(color: const Color(0xFF161D2B)),
                                  ),
                                  child: Text(
                                    ticket.description,
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      color: Color(0xFFCBD5E1),
                                      fontSize: 12,
                                      height: 1.3,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 10),
                                Align(
                                  alignment: Alignment.centerRight,
                                  child: InkWell(
                                    onTap: () {
                                      Navigator.of(context).push(
                                        MaterialPageRoute(builder: (_) => TicketDetailScreen(ticket: ticket)),
                                      );
                                    },
                                    borderRadius: BorderRadius.circular(6),
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: const [
                                          Text(
                                            'View Details',
                                            style: TextStyle(
                                              color: Color(0xFF38BDF8),
                                              fontWeight: FontWeight.w700,
                                              fontSize: 12,
                                            ),
                                          ),
                                          SizedBox(width: 4),
                                          Icon(Icons.arrow_forward_rounded, size: 13, color: Color(0xFF38BDF8)),
                                        ],
                                      ),
                                    ),
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

  Widget _buildSegmentTab(String value, String label, String count) {
    final bool isSelected = _filter == value;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _filter = value),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 7),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF1E2638) : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                label,
                style: TextStyle(
                  color: isSelected ? const Color(0xFFF8FAFC) : const Color(0xFF64748B),
                  fontWeight: FontWeight.w700,
                  fontSize: 12,
                ),
              ),
              const SizedBox(width: 5),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                decoration: BoxDecoration(
                  color: isSelected ? const Color(0xFF0284C7).withValues(alpha: 0.25) : const Color(0xFF161D2B),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  count,
                  style: TextStyle(
                    color: isSelected ? const Color(0xFF38BDF8) : const Color(0xFF64748B),
                    fontWeight: FontWeight.w700,
                    fontSize: 10,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
