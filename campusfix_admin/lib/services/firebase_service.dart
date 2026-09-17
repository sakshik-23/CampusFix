import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/asset_model.dart';
import '../models/ticket_model.dart';

class FirebaseService {
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  static final FirebaseAuth _auth = FirebaseAuth.instance;

  // Real-time stream of all assets
  static Stream<List<CampusAsset>> streamAssets() {
    return _firestore.collection('items').snapshots().map((snapshot) {
      return snapshot.docs.map((doc) {
        return CampusAsset.fromMap(doc.data(), doc.id);
      }).toList();
    });
  }

  // Real-time stream of all tickets
  static Stream<List<CampusTicket>> streamTickets() {
    return _firestore
        .collection('tickets')
        .snapshots()
        .map((snapshot) {
      final list = snapshot.docs.map((doc) {
        return CampusTicket.fromMap(doc.data(), doc.id);
      }).toList();
      // Sort by createdAt descending
      list.sort((a, b) {
        if (a.createdAt == null) return 1;
        if (b.createdAt == null) return -1;
        return b.createdAt!.compareTo(a.createdAt!);
      });
      return list;
    });
  }

  // Create a new asset in Firestore
  static Future<void> createAsset(CampusAsset asset) async {
    final now = DateTime.now().toIso8601String();
    final data = asset.toMap();
    data['createdAt'] = now;
    data['updatedAt'] = now;
    data['locationUpdatedAt'] = now;
    try {
      await _firestore.collection('items').doc(asset.itemId).set(data);
    } catch (e) {
      debugPrint("Error creating asset ${asset.itemId}: $e");
      rethrow;
    }
  }

  // Generate next auto-incremented Asset ID
  static Future<String> generateNextAssetId() async {
    try {
      final snapshot = await _firestore.collection('items').get();
      int highest = 0;
      for (final doc in snapshot.docs) {
        final id = doc.id;
        final match = RegExp(r'AST-(\d+)').firstMatch(id);
        if (match != null) {
          final num = int.tryParse(match.group(1)!) ?? 0;
          if (num > highest) highest = num;
        }
      }
      final nextNum = highest + 1;
      return 'AST-${nextNum.toString().padLeft(6, '0')}';
    } catch (e) {
      return 'AST-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';
    }
  }

  // Fetch single asset by itemId
  static Future<CampusAsset?> getAssetById(String itemId) async {
    try {
      final doc = await _firestore.collection('items').doc(itemId).get();
      if (doc.exists && doc.data() != null) {
        return CampusAsset.fromMap(doc.data()!, doc.id);
      }
      // Try querying by itemId field if doc ID differs
      final query = await _firestore
          .collection('items')
          .where('itemId', isEqualTo: itemId)
          .limit(1)
          .get();
      if (query.docs.isNotEmpty) {
        return CampusAsset.fromMap(query.docs.first.data(), query.docs.first.id);
      }
    } catch (e) {
      print("Error fetching asset $itemId: $e");
    }
    return null;
  }

  // Update GPS coordinates for an asset
  static Future<void> updateAssetLocation(String itemId, double lat, double lng) async {
    final now = DateTime.now().toIso8601String();
    try {
      await _firestore.collection('items').doc(itemId).set({
        'latitude': lat,
        'longitude': lng,
        'locationUpdatedAt': now,
        'updatedAt': now,
      }, SetOptions(merge: true));
    } catch (e) {
      print("Error updating location for $itemId: $e");
      rethrow;
    }
  }

  // Resolve / Close a ticket
  static Future<void> resolveTicket(String ticketId, String notes) async {
    final now = DateTime.now().toIso8601String();
    try {
      await _firestore.collection('tickets').doc(ticketId).set({
        'status': 'CLOSED',
        'adminNotes': notes,
        'closedAt': now,
        'closedBy': 'Admin',
        'updatedAt': now,
      }, SetOptions(merge: true));
    } catch (e) {
      print("Error resolving ticket $ticketId: $e");
      rethrow;
    }
  }

  // Admin authentication
  static Future<bool> login(String email, String password) async {
    try {
      await _auth.signInWithEmailAndPassword(
        email: email.trim(),
        password: password.trim(),
      );
      return true;
    } catch (e) {
      print("FirebaseAuth signin exception: $e. Checking local admin fallback.");
      // Fallback for demo admin credentials if Firebase Auth rules are email/password
      if (email.trim().toLowerCase() == 'admin@campusfix.edu' && password == 'admin123') {
        return true;
      }
      rethrow;
    }
  }
}
