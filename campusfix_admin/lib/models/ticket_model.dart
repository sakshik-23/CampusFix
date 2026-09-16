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
      ticketId: id,
      itemId: map['itemId'] ?? '',
      ticketType: map['ticketType'] ?? 'Not Working',
      description: map['description'] ?? '',
      phoneNumber: map['phoneNumber'] ?? '',
      status: map['status'] ?? 'OPEN',
      latitude: (map['latitude'] as num?)?.toDouble() ?? 18.520430,
      longitude: (map['longitude'] as num?)?.toDouble() ?? 73.856744,
      itemSnapshot: Map<String, dynamic>.from(map['itemSnapshot'] ?? {}),
      adminNotes: map['adminNotes'] ?? '',
      createdAt: map['createdAt'] != null
          ? (map['createdAt'] is String ? DateTime.tryParse(map['createdAt']) : map['createdAt'].toDate())
          : null,
      updatedAt: map['updatedAt'] != null
          ? (map['updatedAt'] is String ? DateTime.tryParse(map['updatedAt']) : map['updatedAt'].toDate())
          : null,
      closedAt: map['closedAt'] != null
          ? (map['closedAt'] is String ? DateTime.tryParse(map['closedAt']) : map['closedAt'].toDate())
          : null,
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
