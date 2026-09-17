import 'package:flutter/material.dart';
import '../models/asset_model.dart';
import '../models/ticket_model.dart';
import '../services/firebase_service.dart';
import '../widgets/status_badge_widget.dart';
import 'assets_screen.dart';
import 'tickets_screen.dart';
import 'ticket_detail_screen.dart';
import 'qr_scanner_screen.dart';
import 'add_asset_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentIndex = 0;

  final List<Widget> _pages = [
    const DashboardHomeTab(),
    const AssetsScreen(),
    const TicketsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF07090E),
      body: _pages[_currentIndex],
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: Color(0xFF0D111A),
          border: Border(top: BorderSide(color: Color(0xFF1E2638), width: 1)),
        ),
        child: BottomNavigationBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          selectedItemColor: const Color(0xFF38BDF8),
          unselectedItemColor: const Color(0xFF64748B),
          selectedFontSize: 11,
          unselectedFontSize: 11,
          type: BottomNavigationBarType.fixed,
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          items: const [
            BottomNavigationBarItem(
              icon: Padding(
                padding: EdgeInsets.only(bottom: 4.0),
                child: Icon(Icons.dashboard_outlined, size: 20),
              ),
              activeIcon: Padding(
                padding: EdgeInsets.only(bottom: 4.0),
                child: Icon(Icons.dashboard_rounded, size: 20),
              ),
              label: 'Overview',
            ),
            BottomNavigationBarItem(
              icon: Padding(
                padding: EdgeInsets.only(bottom: 4.0),
                child: Icon(Icons.inventory_2_outlined, size: 20),
              ),
              activeIcon: Padding(
                padding: EdgeInsets.only(bottom: 4.0),
                child: Icon(Icons.inventory_2_rounded, size: 20),
              ),
              label: 'Assets',
            ),
            BottomNavigationBarItem(
              icon: Padding(
                padding: EdgeInsets.only(bottom: 4.0),
                child: Icon(Icons.confirmation_num_outlined, size: 20),
              ),
              activeIcon: Padding(
                padding: EdgeInsets.only(bottom: 4.0),
                child: Icon(Icons.confirmation_num_rounded, size: 20),
              ),
              label: 'Tickets',
            ),
          ],
        ),
      ),
    );
  }
}

class DashboardHomeTab extends StatelessWidget {
  const DashboardHomeTab({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: StreamBuilder<List<CampusAsset>>(
        stream: FirebaseService.streamAssets(),
        builder: (context, assetSnap) {
          final assets = assetSnap.data ?? [];

          return StreamBuilder<List<CampusTicket>>(
            stream: FirebaseService.streamTickets(),
            builder: (context, ticketSnap) {
              final tickets = ticketSnap.data ?? [];
              final totalAssets = assets.length;
              final activeAssets = assets.where((a) => a.status.toUpperCase() == 'ACTIVE').length;
              final openTickets = tickets.where((t) => t.status.toUpperCase() == 'OPEN').length;
              final closedTickets = tickets.where((t) => t.status.toUpperCase() == 'CLOSED' || t.status.toUpperCase() == 'RESOLVED').length;
              final recentTickets = tickets.take(5).toList();

              final isLoading = (assetSnap.connectionState == ConnectionState.waiting && assets.isEmpty) ||
                  (ticketSnap.connectionState == ConnectionState.waiting && tickets.isEmpty);

              return ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
                children: [
                  // App Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            'CampusFix',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFFF8FAFC),
                              letterSpacing: -0.4,
                            ),
                          ),
                          SizedBox(height: 2),
                          Text(
                            'Asset & Maintenance Control',
                            style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF131B2E),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: const Color(0xFF0284C7).withValues(alpha: 0.3)),
                        ),
                        child: const Text(
                          'ADMIN PORTAL',
                          style: TextStyle(
                            color: Color(0xFF38BDF8),
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.5,
                          ),
                        ),
                      )
                    ],
                  ),
                  const SizedBox(height: 20),

                  if (isLoading)
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 30.0),
                      child: Center(child: CircularProgressIndicator(color: Color(0xFF0284C7), strokeWidth: 2)),
                    )
                  else ...[
                    // Metric Stats Grid
                    Row(
                      children: [
                        Expanded(
                          child: _buildMetricCard(
                            'TOTAL ASSETS',
                            '$totalAssets',
                            const Color(0xFF38BDF8),
                            Icons.devices_rounded,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: _buildMetricCard(
                            'OPEN INCIDENTS',
                            '$openTickets',
                            openTickets > 0 ? const Color(0xFFEF4444) : const Color(0xFF10B981),
                            Icons.error_outline_rounded,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: _buildMetricCard(
                            'RESOLVED',
                            '$closedTickets',
                            const Color(0xFF10B981),
                            Icons.check_circle_outline_rounded,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: _buildMetricCard(
                            'ACTIVE ASSETS',
                            '$activeAssets',
                            const Color(0xFFA78BFA),
                            Icons.layers_outlined,
                          ),
                        ),
                      ],
                    ),
                  ],

                  const SizedBox(height: 20),

                  // Quick Action Cards
                  Row(
                    children: [
                      // Scan QR Card
                      Expanded(
                        child: InkWell(
                          onTap: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const QRScannerScreen()),
                            );
                          },
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: const Color(0xFF0D111A),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFF1E2638)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF0284C7).withValues(alpha: 0.12),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Icon(Icons.qr_code_scanner_rounded, color: Color(0xFF38BDF8), size: 20),
                                ),
                                const SizedBox(height: 12),
                                const Text(
                                  'Scan QR Label',
                                  style: TextStyle(color: Color(0xFFF8FAFC), fontWeight: FontWeight.w700, fontSize: 13),
                                ),
                                const SizedBox(height: 2),
                                const Text(
                                  'Inspect & update GPS',
                                  style: TextStyle(color: Color(0xFF64748B), fontSize: 11),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      // Register Asset Card
                      Expanded(
                        child: InkWell(
                          onTap: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const AddAssetScreen()),
                            );
                          },
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: const Color(0xFF0D111A),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFF1E2638)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF10B981).withValues(alpha: 0.12),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Icon(Icons.add_circle_outline_rounded, color: Color(0xFF34D399), size: 20),
                                ),
                                const SizedBox(height: 12),
                                const Text(
                                  'Register Asset',
                                  style: TextStyle(color: Color(0xFFF8FAFC), fontWeight: FontWeight.w700, fontSize: 13),
                                ),
                                const SizedBox(height: 2),
                                const Text(
                                  'Add new hardware',
                                  style: TextStyle(color: Color(0xFF64748B), fontSize: 11),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Recent Incident Tickets',
                        style: TextStyle(color: Color(0xFFF8FAFC), fontWeight: FontWeight.w700, fontSize: 14, letterSpacing: -0.2),
                      ),
                      if (tickets.isNotEmpty)
                        Text(
                          '${tickets.length} total',
                          style: const TextStyle(color: Color(0xFF64748B), fontSize: 11),
                        ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  if (recentTickets.isEmpty && !isLoading)
                    Container(
                      padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0D111A),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFF1E2638)),
                      ),
                      child: const Center(
                        child: Text(
                          'No incident reports recorded yet',
                          style: TextStyle(color: Color(0xFF64748B), fontSize: 12.5),
                        ),
                      ),
                    )
                  else
                    ...recentTickets.map((t) {
                      final building = t.itemSnapshot['building'] ?? '';
                      final room = t.itemSnapshot['room'] ?? '';
                      final location = (room.isNotEmpty && building.isNotEmpty)
                          ? 'Room $room • $building'
                          : (building.isNotEmpty ? building : 'Campus');

                      return Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF0D111A),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFF1E2638)),
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 3),
                          title: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                t.ticketType,
                                style: const TextStyle(color: Color(0xFFF8FAFC), fontWeight: FontWeight.w700, fontSize: 13.5),
                              ),
                              StatusBadgeWidget(status: t.status),
                            ],
                          ),
                          subtitle: Padding(
                            padding: const EdgeInsets.only(top: 4.0),
                            child: Text(
                              '${t.ticketId} • $location',
                              style: const TextStyle(color: Color(0xFF64748B), fontSize: 11.5),
                            ),
                          ),
                          trailing: const Icon(Icons.chevron_right_rounded, color: Color(0xFF475569), size: 18),
                          onTap: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => TicketDetailScreen(ticket: t)),
                            );
                          },
                        ),
                      );
                    }),
                ],
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildMetricCard(String title, String value, Color color, IconData icon) {
    return Container(
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
              Text(
                title,
                style: const TextStyle(
                  fontSize: 10,
                  color: Color(0xFF64748B),
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.6,
                ),
              ),
              Icon(icon, color: color.withValues(alpha: 0.8), size: 16),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: color,
              letterSpacing: -0.5,
            ),
          ),
        ],
      ),
    );
  }
}
