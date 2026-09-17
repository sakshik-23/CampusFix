import 'package:cloud_firestore/cloud_firestore.dart';

DateTime? _parseDate(dynamic val) {
  if (val == null) return null;
  if (val is Timestamp) return val.toDate();
  if (val is String) return DateTime.tryParse(val);
  if (val is DateTime) return val;
  return null;
}

class CampusAsset {
  final String itemId;
  final String itemName;
  final String itemType;
  final String description;
  final String building;
  final String floor;
  final String room;
  final String manufacturer;
  final String model;
  final String serialNumber;
  final double latitude;
  final double longitude;
  final String status;
  final String qrUrl;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final DateTime? locationUpdatedAt;

  CampusAsset({
    required this.itemId,
    required this.itemName,
    required this.itemType,
    required this.description,
    required this.building,
    required this.floor,
    required this.room,
    this.manufacturer = '',
    this.model = '',
    this.serialNumber = '',
    required this.latitude,
    required this.longitude,
    required this.status,
    required this.qrUrl,
    this.createdAt,
    this.updatedAt,
    this.locationUpdatedAt,
  });

  factory CampusAsset.fromMap(Map<String, dynamic> map, String id) {
    return CampusAsset(
      itemId: map['itemId'] ?? id,
      itemName: map['itemName'] ?? '',
      itemType: map['itemType'] ?? 'Other',
      description: map['description'] ?? '',
      building: map['building'] ?? '',
      floor: map['floor']?.toString() ?? '',
      room: map['room'] ?? '',
      manufacturer: map['manufacturer'] ?? '',
      model: map['model'] ?? '',
      serialNumber: map['serialNumber'] ?? '',
      latitude: (map['latitude'] as num?)?.toDouble() ?? 18.520430,
      longitude: (map['longitude'] as num?)?.toDouble() ?? 73.856744,
      status: map['status'] ?? 'ACTIVE',
      qrUrl: (map['qrUrl'] != null && map['qrUrl'].toString().isNotEmpty && !map['qrUrl'].toString().contains('web.app'))
          ? map['qrUrl'].toString()
          : 'https://campusfix1.vercel.app/report/${map['itemId'] ?? id}',
      createdAt: _parseDate(map['createdAt']),
      updatedAt: _parseDate(map['updatedAt']),
      locationUpdatedAt: _parseDate(map['locationUpdatedAt']),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'itemId': itemId,
      'itemName': itemName,
      'itemType': itemType,
      'description': description,
      'building': building,
      'floor': floor,
      'room': room,
      'manufacturer': manufacturer,
      'model': model,
      'serialNumber': serialNumber,
      'latitude': latitude,
      'longitude': longitude,
      'status': status,
      'qrUrl': qrUrl,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
      'locationUpdatedAt': locationUpdatedAt?.toIso8601String(),
    };
  }
}
