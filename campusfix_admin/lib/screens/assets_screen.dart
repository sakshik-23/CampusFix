import 'package:flutter/material.dart';
import '../models/asset_model.dart';
import 'asset_detail_screen.dart';

class AssetsScreen extends StatefulWidget {
  const AssetsScreen({Key? key}) : super(key: key);

  @override
  State<AssetsScreen> createState() => _AssetsScreenState();
}

class _AssetsScreenState extends State<AssetsScreen> {
  final List<CampusAsset> _sampleAssets = [
    CampusAsset(
      itemId: 'AST-000001',
      itemName: 'Projector #01',
      itemType: 'Projector',
      description: 'Ceiling-mounted Epson EB-X06 projector with HDMI/VGA inputs.',
      building: 'Main Academic Block',
      floor: '2',
      room: 'A-203',
      manufacturer: 'Epson',
      model: 'EB-X06',
      serialNumber: 'SN-EPS-98214',
      latitude: 18.520430,
      longitude: 73.856744,
      status: 'ACTIVE',
      qrUrl: 'https://campusfix.web.app/report/AST-000001',
    ),
    CampusAsset(
      itemId: 'AST-000002',
      itemName: 'AC Unit #02',
      itemType: 'AC',
      description: 'Voltas 2-Ton Split Inverter Air Conditioner.',
      building: 'Main Academic Block',
      floor: '2',
      room: 'A-203',
      manufacturer: 'Voltas',
      model: '183V CZT',
      serialNumber: 'SN-VOL-44120',
      latitude: 18.520480,
      longitude: 73.856790,
      status: 'ACTIVE',
      qrUrl: 'https://campusfix.web.app/report/AST-000002',
    ),
    CampusAsset(
      itemId: 'AST-000003',
      itemName: 'Ceiling Fan #04',
      itemType: 'Fan',
      description: 'Havells 1200mm high-speed ceiling fan near entrance.',
      building: 'Science & CS Block',
      floor: '3',
      room: 'B-301',
      manufacturer: 'Havells',
      model: 'Stealth Air',
      serialNumber: 'SN-HAV-10922',
      latitude: 18.521150,
      longitude: 73.857320,
      status: 'ACTIVE',
      qrUrl: 'https://campusfix.web.app/report/AST-000003',
    ),
  ];

  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    final filtered = _sampleAssets.where((a) {
      final q = _searchQuery.toLowerCase();
      return a.itemId.toLowerCase().contains(q) ||
          a.itemName.toLowerCase().contains(q) ||
          a.room.toLowerCase().contains(q) ||
          a.building.toLowerCase().contains(q);
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFF0B0F19),
      appBar: AppBar(
        backgroundColor: const Color(0xFF111827),
        elevation: 0,
        title: const Text('Campus Assets', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: TextField(
              style: const TextStyle(color: Colors.white),
              onChanged: (val) => setState(() => _searchQuery = val),
              decoration: InputDecoration(
                hintText: 'Search by ID, name, room...',
                hintStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 13),
                filled: true,
                fillColor: const Color(0xFF111827),
                prefixIcon: const Icon(Icons.search, color: Color(0xFF64748B), size: 18),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF1E293B))),
                enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF1E293B))),
                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              ),
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              itemCount: filtered.length,
              itemBuilder: (context, index) {
                final asset = filtered[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  decoration: BoxDecoration(
                    color: const Color(0xFF111827),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: const Color(0xFF1E293B)),
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                    title: Text(asset.itemName, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                    subtitle: Text('${asset.itemId} • Room ${asset.room} (${asset.building})', style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
                    trailing: const Icon(Icons.chevron_right, color: Color(0xFF64748B)),
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => AssetDetailScreen(asset: asset)),
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
