import 'package:flutter/material.dart';
import '../models/asset_model.dart';
import '../models/ticket_model.dart';
import '../services/firebase_service.dart';
import '../widgets/status_badge_widget.dart';
import '../theme/app_colors.dart';
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
      backgroundColor: AppColors.background,
      body: _pages[_currentIndex],
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: AppColors.surface,
          border: Border(top: BorderSide(color: AppColors.border, width: 1)),
        ),
        child: BottomNavigationBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          selectedItemColor: AppColors.primary,
          unselectedItemColor: AppColors.textMuted,
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
              final activeTickets = tickets.where((t) {
                final st = t.status.toUpperCase();
                return st != 'CLOSED' && st != 'RESOLVED';
              }).toList();
              final openTickets = activeTickets.where((t) => t.status.toUpperCase() == 'OPEN' || t.status.toUpperCase() == 'ACTIVE').length;
              final recentTickets = activeTickets.take(5).toList();
              final systemHealth = totalAssets > 0 ? (((totalAssets - activeTickets.length) / totalAssets) * 100).round() : 100;

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
                              color: AppColors.textPrimary,
                              letterSpacing: -0.4,
                            ),
                          ),
                          SizedBox(height: 2),
                          Text(
                            'Asset & Maintenance Control',
                            style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.primaryLight,
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: AppColors.primaryBorder),
                        ),
                        child: const Text(
                          'ADMIN PORTAL',
                          style: TextStyle(
                            color: AppColors.primary,
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
                      child: Center(child: CircularProgressIndicator(color: AppColors.primary, strokeWidth: 2)),
                    )
                  else ...[
                    // Metric Stats Grid
                    Row(
                      children: [
                        Expanded(
                          child: _buildMetricCard(
                            'TOTAL ASSETS',
                            '$totalAssets',
                            AppColors.primary,
                            Icons.devices_rounded,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: _buildMetricCard(
                            'ACTIVE TICKETS',
                            '$openTickets',
                            AppColors.textSecondary,
                            Icons.confirmation_num_outlined,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: _buildMetricCard(
                            'SYSTEM HEALTH',
                            '$systemHealth%',
                            AppColors.success,
                            Icons.health_and_safety_outlined,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: _buildMetricCard(
                            'ACTIVE ASSETS',
                            '$activeAssets',
                            const Color(0xFF6366F1),
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
                              color: AppColors.surface,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppColors.border),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFF0F172A).withValues(alpha: 0.03),
                                  blurRadius: 10,
                                  offset: const Offset(0, 2),
                                )
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: AppColors.primaryLight,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Icon(Icons.qr_code_scanner_rounded, color: AppColors.primary, size: 20),
                                ),
                                const SizedBox(height: 12),
                                const Text(
                                  'Scan QR Label',
                                  style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700, fontSize: 13),
                                ),
                                const SizedBox(height: 2),
                                const Text(
                                  'Inspect & update GPS',
                                  style: TextStyle(color: AppColors.textMuted, fontSize: 11),
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
                              color: AppColors.surface,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppColors.border),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFF0F172A).withValues(alpha: 0.03),
                                  blurRadius: 10,
                                  offset: const Offset(0, 2),
                                )
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: AppColors.successLight,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Icon(Icons.add_circle_outline_rounded, color: AppColors.success, size: 20),
                                ),
                                const SizedBox(height: 12),
                                const Text(
                                  'Register Asset',
                                  style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700, fontSize: 13),
                                ),
                                const SizedBox(height: 2),
                                const Text(
                                  'Add new hardware',
                                  style: TextStyle(color: AppColors.textMuted, fontSize: 11),
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
                        style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700, fontSize: 14, letterSpacing: -0.2),
                      ),
                      if (tickets.isNotEmpty)
                        Text(
                          '${tickets.length} total',
                          style: const TextStyle(color: AppColors.textMuted, fontSize: 11),
                        ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  if (recentTickets.isEmpty && !isLoading)
                    Container(
                      padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: const Center(
                        child: Text(
                          'No incident reports recorded yet',
                          style: TextStyle(color: AppColors.textMuted, fontSize: 12.5),
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
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.border),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF0F172A).withValues(alpha: 0.02),
                              blurRadius: 6,
                              offset: const Offset(0, 1),
                            )
                          ],
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 3),
                          title: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                t.ticketType,
                                style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700, fontSize: 13.5),
                              ),
                              StatusBadgeWidget(status: t.status),
                            ],
                          ),
                          subtitle: Padding(
                            padding: const EdgeInsets.only(top: 4.0),
                            child: Text(
                              '${t.ticketId} • $location',
                              style: const TextStyle(color: AppColors.textMuted, fontSize: 11.5),
                            ),
                          ),
                          trailing: const Icon(Icons.chevron_right_rounded, color: AppColors.textMuted, size: 18),
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
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F172A).withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 2),
          )
        ],
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
                  color: AppColors.textMuted,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.6,
                ),
              ),
              Icon(icon, color: color, size: 16),
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
