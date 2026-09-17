import 'package:flutter/material.dart';
import '../models/asset_model.dart';
import '../services/firebase_service.dart';
import 'asset_detail_screen.dart';
import 'add_asset_screen.dart';

class AssetsScreen extends StatefulWidget {
  const AssetsScreen({Key? key}) : super(key: key);

  @override
  State<AssetsScreen> createState() => _AssetsScreenState();
}

class _AssetsScreenState extends State<AssetsScreen> {
  String _searchQuery = '';
  final _searchController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF07090E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0D111A),
        elevation: 0,
        title: const Text(
          'Asset Registry',
          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17, color: Color(0xFFF8FAFC), letterSpacing: -0.3),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline_rounded, color: Color(0xFF38BDF8), size: 22),
            tooltip: 'Register New Asset',
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const AddAssetScreen()),
              );
            },
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
            child: TextField(
              controller: _searchController,
              style: const TextStyle(color: Colors.white, fontSize: 13.5),
              onChanged: (val) => setState(() => _searchQuery = val),
              decoration: InputDecoration(
                hintText: 'Search by ID, name, building, room...',
                hintStyle: const TextStyle(color: Color(0xFF475569), fontSize: 13),
                filled: true,
                fillColor: const Color(0xFF0D111A),
                prefixIcon: const Icon(Icons.search_rounded, color: Color(0xFF64748B), size: 18),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.close_rounded, color: Color(0xFF64748B), size: 16),
                        onPressed: () {
                          _searchController.clear();
                          setState(() => _searchQuery = '');
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: Color(0xFF1E2638)),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: Color(0xFF1E2638)),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: Color(0xFF0284C7), width: 1.5),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              ),
            ),
          ),
          Expanded(
            child: StreamBuilder<List<CampusAsset>>(
              stream: FirebaseService.streamAssets(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting && !snapshot.hasData) {
                  return const Center(child: CircularProgressIndicator(color: Color(0xFF0284C7), strokeWidth: 2));
                }

                if (snapshot.hasError) {
                  return Center(
                    child: Text('Error loading assets: ${snapshot.error}', style: const TextStyle(color: Color(0xFFEF4444))),
                  );
                }

                final assets = snapshot.data ?? [];
                final filtered = assets.where((a) {
                  final q = _searchQuery.toLowerCase();
                  return a.itemId.toLowerCase().contains(q) ||
                      a.itemName.toLowerCase().contains(q) ||
                      a.room.toLowerCase().contains(q) ||
                      a.building.toLowerCase().contains(q) ||
                      a.itemType.toLowerCase().contains(q);
                }).toList();

                if (filtered.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.inventory_2_outlined, size: 40, color: Color(0xFF334155)),
                        const SizedBox(height: 12),
                        Text(
                          _searchQuery.isEmpty ? 'No assets registered yet' : 'No assets matching "$_searchQuery"',
                          style: const TextStyle(color: Color(0xFF64748B), fontSize: 13),
                        ),
                      ],
                    ),
                  );
                }

                return ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final asset = filtered[index];
                    final building = asset.building;
                    final room = asset.room;
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
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                        title: Row(
                          children: [
                            Text(
                              asset.itemId,
                              style: const TextStyle(
                                color: Color(0xFF38BDF8),
                                fontFamily: 'monospace',
                                fontWeight: FontWeight.w700,
                                fontSize: 12,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: const Color(0xFF1E2638),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                asset.itemType,
                                style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 10, fontWeight: FontWeight.w600),
                              ),
                            ),
                          ],
                        ),
                        subtitle: Padding(
                          padding: const EdgeInsets.only(top: 4.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                asset.itemName,
                                style: const TextStyle(color: Color(0xFFF8FAFC), fontWeight: FontWeight.w700, fontSize: 14),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                location,
                                style: const TextStyle(color: Color(0xFF64748B), fontSize: 11.5),
                              ),
                            ],
                          ),
                        ),
                        trailing: const Icon(Icons.chevron_right_rounded, color: Color(0xFF475569), size: 18),
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => AssetDetailScreen(asset: asset)),
                          );
                        },
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
