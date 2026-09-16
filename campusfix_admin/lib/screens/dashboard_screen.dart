import 'package:flutter/material.dart';
import 'assets_screen.dart';
import 'tickets_screen.dart';
import 'qr_scanner_screen.dart';

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
      child: ListView(
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
                  color: const Color(0x263B82F6),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFF3B82F6).withOpacity(0.3)),
                ),
                child: const Text('ADMIN', style: TextStyle(color: Color(0xFF60A5FA), fontSize: 10, fontWeight: FontWeight.bold)),
              )
            ],
          ),
          const SizedBox(height: 20),

          // Stat Cards Grid
          Row(
            children: [
              Expanded(
                child: _buildMetricCard('Total Assets', '6', const Color(0xFF3B82F6), Icons.devices),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildMetricCard('Open Tickets', '2', const Color(0xFFEF4444), Icons.error_outline),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildMetricCard('Closed Tickets', '1', const Color(0xFF10B981), Icons.check_circle_outline),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildMetricCard('Active Assets', '6', const Color(0xFFA855F7), Icons.layers_outlined),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Quick Scan Banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
              ),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF334155)),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF3B82F6).withOpacity(0.15),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.qr_code_scanner, color: Color(0xFF3B82F6), size: 28),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text('On-Site Asset Scanner', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                      SizedBox(height: 2),
                      Text('Scan physical asset QR to view details or update GPS location on-site.', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
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
