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
      backgroundColor: const Color(0xFF0B0F19),
      body: _pages[_currentIndex],
      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color(0xFF3B82F6),
        child: const Icon(Icons.qr_code_scanner_rounded, color: Colors.white),
        onPressed: () {
          Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => const QRScannerScreen()),
          );
        },
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: Color(0xFF1E293B))),
        ),
        child: BottomNavigationBar(
          backgroundColor: const Color(0xFF111827),
          selectedItemColor: const Color(0xFF3B82F6),
          unselectedItemColor: const Color(0xFF64748B),
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_outlined),
              activeIcon: Icon(Icons.dashboard),
              label: 'Dashboard',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.inventory_2_outlined),
              activeIcon: Icon(Icons.inventory_2),
              label: 'Assets',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.confirmation_num_outlined),
              activeIcon: Icon(Icons.confirmation_num),
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
              final closedTickets = tickets.where((t) => t.status.toUpperCase() == 'CLOSED').length;
              final recentTickets = tickets.take(4).toList();

              final isLoading = (assetSnap.connectionState == ConnectionState.waiting && assets.isEmpty) ||
                  (ticketSnap.connectionState == ConnectionState.waiting && tickets.isEmpty);

              return ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text('CampusFix Admin', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white)),
                          Text('On-Site Maintenance Control', style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0x2610B981),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFF10B981).withOpacity(0.3)),
                        ),
                        child: Row(
                          children: const [
                            Icon(Icons.cloud_done, size: 12, color: Color(0xFF34D399)),
                            SizedBox(width: 4),
                            Text('FIREBASE LIVE', style: TextStyle(color: Color(0xFF34D399), fontSize: 10, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      )
                    ],
                  ),
                  const SizedBox(height: 20),

                  if (isLoading)
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 20.0),
                      child: Center(child: CircularProgressIndicator(color: Color(0xFF3B82F6))),
                    )
                  else ...[
                    // Stat Cards Grid
                    Row(
                      children: [
                        Expanded(
                          child: _buildMetricCard('Total Assets', '$totalAssets', const Color(0xFF3B82F6), Icons.devices),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildMetricCard('Open Tickets', '$openTickets', const Color(0xFFEF4444), Icons.error_outline),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: _buildMetricCard('Closed Tickets', '$closedTickets', const Color(0xFF10B981), Icons.check_circle_outline),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildMetricCard('Active Assets', '$activeAssets', const Color(0xFFA855F7), Icons.layers_outlined),
                        ),
                      ],
                    ),
                  ],

                  const SizedBox(height: 20),

                  // Quick Actions Grid
                  Row(
                    children: [
                      // Quick Scan Card
                      Expanded(
                        child: GestureDetector(
                          onTap: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const QRScannerScreen()),
                            );
                          },
                          child: Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
                              ),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFF334155)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF3B82F6).withOpacity(0.15),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Icon(Icons.qr_code_scanner, color: Color(0xFF3B82F6), size: 22),
                                ),
                                const SizedBox(height: 10),
                                const Text('Scan QR Code', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                                const SizedBox(height: 2),
                                const Text('Inspect & tag GPS', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10)),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      // Add Asset Card
                      Expanded(
                        child: GestureDetector(
                          onTap: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const AddAssetScreen()),
                            );
                          },
                          child: Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
                              ),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFF334155)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF10B981).withOpacity(0.15),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Icon(Icons.add_box_outlined, color: Color(0xFF10B981), size: 22),
                                ),
                                const SizedBox(height: 10),
                                const Text('Register Asset', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                                const SizedBox(height: 2),
                                const Text('Add on-site & QR', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10)),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),
                  const Text('Recent Incident Reports', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                  const SizedBox(height: 10),

                  if (recentTickets.isEmpty && !isLoading)
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFF111827),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: const Color(0xFF1E293B)),
                      ),
                      child: const Center(
                        child: Text('No incident tickets yet.', style: TextStyle(color: Color(0xFF64748B), fontSize: 13)),
                      ),
                    )
                  else
                    ...recentTickets.map((t) => Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          decoration: BoxDecoration(
                            color: const Color(0xFF111827),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: const Color(0xFF1E293B)),
                          ),
                          child: ListTile(
                            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
                            title: Text(t.ticketType, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                            subtitle: Text('${t.ticketId} • ${t.itemId}', style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
                            trailing: StatusBadgeWidget(status: t.status),
                            onTap: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(builder: (_) => TicketDetailScreen(ticket: t)),
                              );
                            },
                          ),
                        )),
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
              Text(title, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8), fontWeight: FontWeight.w600)),
              Icon(icon, color: color, size: 16),
            ],
          ),
          const SizedBox(height: 6),
          Text(value, style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: color)),
        ],
      ),
    );
  }
}
