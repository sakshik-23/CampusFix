import 'package:cloud_firestore/cloud_firestore.dart';

DateTime? _parseDate(dynamic val) {
  if (val == null) return null;
  if (val is Timestamp) return val.toDate();
  if (val is String) return DateTime.tryParse(val);
  if (val is DateTime) return val;
  return null;
}

class CampusTicket {
  final String ticketId;
  final String itemId;
  final String ticketType;
  final String description;
  final String phoneNumber;
  final String status;
  final double latitude;
  final double longitude;
  final Map<String, dynamic> itemSnapshot;
  final String adminNotes;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final DateTime? closedAt;
  final String? closedBy;

  CampusTicket({
    required this.ticketId,
    required this.itemId,
    required this.ticketType,
    required this.description,
    required this.phoneNumber,
    required this.status,
    required this.latitude,
    required this.longitude,
    required this.itemSnapshot,
    this.adminNotes = '',
    this.createdAt,
    this.updatedAt,
    this.closedAt,
    this.closedBy,
  });

  factory CampusTicket.fromMap(Map<String, dynamic> map, String id) {
    return CampusTicket(
      ticketId: map['ticketId'] ?? id,
      itemId: map['itemId'] ?? '',
      ticketType: map['ticketType'] ?? 'Not Working',
      description: map['description'] ?? '',
      phoneNumber: map['phoneNumber'] ?? '',
      status: map['status'] ?? 'OPEN',
      latitude: (map['latitude'] as num?)?.toDouble() ?? 18.520430,
      longitude: (map['longitude'] as num?)?.toDouble() ?? 73.856744,
      itemSnapshot: Map<String, dynamic>.from(map['itemSnapshot'] ?? {}),
      adminNotes: map['adminNotes'] ?? '',
      createdAt: _parseDate(map['createdAt']),
      updatedAt: _parseDate(map['updatedAt']),
      closedAt: _parseDate(map['closedAt'] ?? map['resolvedAt']),
      closedBy: map['closedBy'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'ticketId': ticketId,
      'itemId': itemId,
      'ticketType': ticketType,
      'description': description,
      'phoneNumber': phoneNumber,
      'status': status,
      'latitude': latitude,
      'longitude': longitude,
      'itemSnapshot': itemSnapshot,
      'adminNotes': adminNotes,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
      'closedAt': closedAt?.toIso8601String(),
      'closedBy': closedBy,
    };
  }
}
