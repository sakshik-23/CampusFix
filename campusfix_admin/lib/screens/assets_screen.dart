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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0F19),
      appBar: AppBar(
        backgroundColor: const Color(0xFF111827),
        elevation: 0,
        title: const Text('Campus Assets', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline, color: Color(0xFF38BDF8)),
            tooltip: 'Add New Asset',
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const AddAssetScreen()),
              );
            },
          ),
        ],
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
            child: StreamBuilder<List<CampusAsset>>(
              stream: FirebaseService.streamAssets(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting && !snapshot.hasData) {
                  return const Center(child: CircularProgressIndicator(color: Color(0xFF3B82F6)));
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
                      a.building.toLowerCase().contains(q);
                }).toList();

                if (filtered.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Icon(Icons.inventory_2_outlined, size: 48, color: Color(0xFF334155)),
                        SizedBox(height: 12),
                        Text('No campus assets found', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 14)),
                      ],
                    ),
                  );
                }

                return ListView.builder(
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
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
