import 'package:flutter/material.dart';
import '../models/ticket_model.dart';
import '../services/firebase_service.dart';
import '../widgets/status_badge_widget.dart';
import '../theme/app_colors.dart';
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
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        title: const Text(
          'Incident Tickets',
          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17, color: AppColors.textPrimary, letterSpacing: -0.3),
        ),
      ),
      body: StreamBuilder<List<CampusTicket>>(
        stream: FirebaseService.streamTickets(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting && !snapshot.hasData) {
            return const Center(child: CircularProgressIndicator(color: AppColors.primary, strokeWidth: 2));
          }

          if (snapshot.hasError) {
            return Center(
              child: Text('Error loading tickets: ${snapshot.error}', style: const TextStyle(color: AppColors.danger)),
            );
          }

          final allRawTickets = snapshot.data ?? [];
          // Resolved tickets are deleted from the system, so filter to active tickets
          final allTickets = allRawTickets.where((t) {
            final st = t.status.toUpperCase();
            return st != 'CLOSED' && st != 'RESOLVED';
          }).toList();

          final openCount = allTickets.where((t) => t.status.toUpperCase() == 'OPEN' || t.status.toUpperCase() == 'ACTIVE').length;
          final inProgressCount = allTickets.where((t) => t.status.toUpperCase() == 'IN_PROGRESS' || t.status.toUpperCase() == 'IN PROGRESS').length;

          final filtered = allTickets.where((t) {
            final st = t.status.toUpperCase();
            if (_filter == 'OPEN') return st == 'OPEN' || st == 'ACTIVE';
            if (_filter == 'IN_PROGRESS') return st == 'IN_PROGRESS' || st == 'IN PROGRESS';
            return true;
          }).toList();

          return Column(
            children: [
              // Segmented Filter Bar matching web portal
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.border),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF0F172A).withValues(alpha: 0.02),
                      blurRadius: 6,
                      offset: const Offset(0, 1),
                    )
                  ],
                ),
                child: Row(
                  children: [
                    _buildSegmentTab('ALL', 'All Active', '${allTickets.length}'),
                    _buildSegmentTab('OPEN', 'Open', '$openCount'),
                    _buildSegmentTab('IN_PROGRESS', 'In Progress', '$inProgressCount'),
                  ],
                ),
              ),

              Expanded(
                child: filtered.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.confirmation_num_outlined, size: 40, color: AppColors.textMuted),
                            const SizedBox(height: 12),
                            Text(
                              _filter == 'ALL'
                                  ? 'No active incident reports'
                                  : 'No $_filter tickets found',
                              style: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
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
                              color: AppColors.surface,
                              borderRadius: BorderRadius.circular(12),
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
                                    Row(
                                      children: [
                                        Text(
                                          ticket.ticketId,
                                          style: const TextStyle(
                                            color: AppColors.primary,
                                            fontFamily: 'monospace',
                                            fontWeight: FontWeight.w700,
                                            fontSize: 12,
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Text(
                                          '•  ${ticket.itemId}',
                                          style: const TextStyle(color: AppColors.textMuted, fontSize: 11.5),
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
                                    color: AppColors.textPrimary,
                                    fontWeight: FontWeight.w700,
                                    fontSize: 13.5,
                                  ),
                                ),
                                if (room.isNotEmpty || building.isNotEmpty) ...[
                                  const SizedBox(height: 2),
                                  Text(
                                    'Room $room ($building)',
                                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 11.5),
                                  ),
                                ],
                                const SizedBox(height: 8),
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                  decoration: BoxDecoration(
                                    color: AppColors.cardSubtle,
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(color: AppColors.borderLight),
                                  ),
                                  child: Text(
                                    ticket.description,
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      color: AppColors.textSecondary,
                                      fontSize: 12,
                                      height: 1.3,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 10),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    OutlinedButton.icon(
                                      onPressed: () => _confirmQuickResolve(context, ticket),
                                      icon: const Icon(Icons.check_circle_outline_rounded, size: 14, color: AppColors.success),
                                      label: const Text('Resolve', style: TextStyle(color: AppColors.success, fontSize: 11.5, fontWeight: FontWeight.w700)),
                                      style: OutlinedButton.styleFrom(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                        side: const BorderSide(color: Color(0xFF86EFAC)),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                                      ),
                                    ),
                                    InkWell(
                                      onTap: () {
                                        Navigator.of(context).push(
                                          MaterialPageRoute(builder: (_) => TicketDetailScreen(ticket: ticket)),
                                        );
                                      },
                                      borderRadius: BorderRadius.circular(6),
                                      child: const Padding(
                                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Text(
                                              'View Details',
                                              style: TextStyle(
                                                color: AppColors.primary,
                                                fontWeight: FontWeight.w700,
                                                fontSize: 12,
                                              ),
                                            ),
                                            SizedBox(width: 4),
                                            Icon(Icons.arrow_forward_rounded, size: 13, color: AppColors.primary),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ],
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
            color: isSelected ? AppColors.surface : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.04),
                      blurRadius: 3,
                      offset: const Offset(0, 1),
                    ),
                  ]
                : null,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                label,
                style: TextStyle(
                  color: isSelected ? AppColors.textPrimary : AppColors.textMuted,
                  fontWeight: FontWeight.w700,
                  fontSize: 12,
                ),
              ),
              const SizedBox(width: 5),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.primary.withOpacity(0.12) : AppColors.borderLight,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  count,
                  style: TextStyle(
                    color: isSelected ? AppColors.primary : AppColors.textSecondary,
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

  void _confirmQuickResolve(BuildContext context, CampusTicket ticket) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.border),
        ),
        title: const Text(
          'Resolve Incident Ticket?',
          style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700, fontSize: 16),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              margin: const EdgeInsets.only(bottom: 10),
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
                      'Marking this ticket as Resolved will permanently delete and remove it from the system.',
                      style: TextStyle(color: Color(0xFFB91C1C), fontSize: 11.5, fontWeight: FontWeight.w500),
                    ),
                  ),
                ],
              ),
            ),
            Text(
              'Ticket ID: ${ticket.ticketId}',
              style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.primary, fontFamily: 'monospace', fontSize: 13),
            ),
            const SizedBox(height: 4),
            Text(
              'Issue: ${ticket.ticketType}',
              style: const TextStyle(color: AppColors.textSecondary, fontSize: 12.5),
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
              try {
                await FirebaseService.resolveTicket(ticket.ticketId, 'Resolved by administrator');
                if (!context.mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Ticket ${ticket.ticketId} resolved and deleted'),
                    backgroundColor: AppColors.success,
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              } catch (e) {
                if (!context.mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Failed to resolve ticket: $e'),
                    backgroundColor: AppColors.danger,
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              }
            },
            child: const Text('Resolve & Delete', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
          ),
        ],
      ),
    );
  }
}
