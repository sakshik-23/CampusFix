import 'package:flutter/material.dart';
import '../models/asset_model.dart';
import '../services/firebase_service.dart';
import '../services/location_service.dart';
import 'asset_detail_screen.dart';

class AddAssetScreen extends StatefulWidget {
  const AddAssetScreen({Key? key}) : super(key: key);

  @override
  State<AddAssetScreen> createState() => _AddAssetScreenState();
}

class _AddAssetScreenState extends State<AddAssetScreen> {
  final _formKey = GlobalKey<FormState>();

  final _idController = TextEditingController();
  final _nameController = TextEditingController();
  final _descController = TextEditingController();
  final _buildingController = TextEditingController(text: 'Main Academic Block');
  final _floorController = TextEditingController(text: '1');
  final _roomController = TextEditingController(text: '101');
  final _manufacturerController = TextEditingController();
  final _modelController = TextEditingController();
  final _serialController = TextEditingController();

  String _selectedCategory = 'Projector';
  double _latitude = 18.520430;
  double _longitude = 73.856744;

  bool _isLoadingId = true;
  bool _isSaving = false;
  bool _fetchingGps = false;

  final List<String> _categories = [
    'Projector',
    'AC',
    'Fan',
    'Smart Board',
    'Lab Equipment',
    'Furniture',
    'Water Dispenser',
    'Printer',
    'Network Switch',
    'Lighting',
    'Other'
  ];

  @override
  void initState() {
    super.initState();
    _initAutoId();
    _fetchCurrentGps();
  }

  Future<void> _initAutoId() async {
    final nextId = await FirebaseService.generateNextAssetId();
    if (mounted) {
      setState(() {
        _idController.text = nextId;
        _isLoadingId = false;
      });
    }
  }

  Future<void> _fetchCurrentGps() async {
    setState(() => _fetchingGps = true);
    final pos = await LocationService.getCurrentLocation();
    if (mounted) {
      setState(() {
        _fetchingGps = false;
        if (pos != null) {
          _latitude = pos.latitude;
          _longitude = pos.longitude;
        }
      });
    }
  }

  Future<void> _saveAsset() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSaving = true);

    final assetId = _idController.text.trim();
    final qrUrl = 'https://campusfix1.vercel.app/report/$assetId';

    final newAsset = CampusAsset(
      itemId: assetId,
      itemName: _nameController.text.trim(),
      itemType: _selectedCategory,
      description: _descController.text.trim(),
      building: _buildingController.text.trim(),
      floor: _floorController.text.trim(),
      room: _roomController.text.trim(),
      manufacturer: _manufacturerController.text.trim(),
      model: _modelController.text.trim(),
      serialNumber: _serialController.text.trim(),
      latitude: _latitude,
      longitude: _longitude,
      status: 'ACTIVE',
      qrUrl: qrUrl,
    );

    try {
      await FirebaseService.createAsset(newAsset);
      if (!mounted) return;
      setState(() => _isSaving = false);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Asset $assetId registered successfully'),
          backgroundColor: const Color(0xFF10B981),
          behavior: SnackBarBehavior.floating,
        ),
      );

      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => AssetDetailScreen(asset: newAsset)),
      );
    } catch (e) {
      if (!mounted) return;
      setState(() => _isSaving = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to save asset: $e'),
          backgroundColor: const Color(0xFFEF4444),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF07090E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0D111A),
        elevation: 0,
        title: const Text(
          'Register New Asset',
          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17, color: Color(0xFFF8FAFC), letterSpacing: -0.3),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Asset ID & Category Row
                Row(
                  children: [
                    Expanded(
                      flex: 1,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('ASSET ID', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                          const SizedBox(height: 6),
                          TextFormField(
                            controller: _idController,
                            style: const TextStyle(color: Color(0xFF38BDF8), fontFamily: 'monospace', fontWeight: FontWeight.w700, fontSize: 13.5),
                            decoration: InputDecoration(
                              filled: true,
                              fillColor: const Color(0xFF0D111A),
                              suffixIcon: _isLoadingId
                                  ? const SizedBox(
                                      width: 14,
                                      height: 14,
                                      child: Center(
                                        child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF0284C7)),
                                      ),
                                    )
                                  : null,
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF1E2638))),
                              enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF1E2638))),
                              focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF0284C7))),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                            ),
                            validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      flex: 1,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('CATEGORY', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            decoration: BoxDecoration(
                              color: const Color(0xFF0D111A),
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: const Color(0xFF1E2638)),
                            ),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: _selectedCategory,
                                dropdownColor: const Color(0xFF0D111A),
                                isExpanded: true,
                                style: const TextStyle(color: Color(0xFFF8FAFC), fontSize: 13.5, fontWeight: FontWeight.w600),
                                items: _categories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                                onChanged: (val) {
                                  if (val != null) setState(() => _selectedCategory = val);
                                },
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Asset Name
                const Text('ASSET NAME *', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _nameController,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: InputDecoration(
                    hintText: 'e.g. Epson Ceiling Projector #02',
                    hintStyle: const TextStyle(color: Color(0xFF475569), fontSize: 13),
                    filled: true,
                    fillColor: const Color(0xFF0D111A),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF1E2638))),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF1E2638))),
                    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF0284C7))),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  ),
                  validator: (v) => (v == null || v.isEmpty) ? 'Please enter asset name' : null,
                ),
                const SizedBox(height: 16),

                // Description
                const Text('DESCRIPTION', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _descController,
                  maxLines: 2,
                  style: const TextStyle(color: Colors.white, fontSize: 13.5),
                  decoration: InputDecoration(
                    hintText: 'e.g. HDMI projector connected to main instructor podium.',
                    hintStyle: const TextStyle(color: Color(0xFF475569), fontSize: 13),
                    filled: true,
                    fillColor: const Color(0xFF0D111A),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF1E2638))),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF1E2638))),
                    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF0284C7))),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  ),
                ),
                const SizedBox(height: 16),

                // Location Details (Building, Floor, Room)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0D111A),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFF1E2638)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('LOCATION PLACEMENT', style: TextStyle(color: Color(0xFF38BDF8), fontWeight: FontWeight.w700, fontSize: 11, letterSpacing: 0.6)),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _buildingController,
                        style: const TextStyle(color: Colors.white, fontSize: 13.5),
                        decoration: const InputDecoration(
                          labelText: 'Building Name',
                          labelStyle: TextStyle(color: Color(0xFF64748B), fontSize: 12),
                          border: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF1E2638))),
                          enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF1E2638))),
                          focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF0284C7))),
                        ),
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _floorController,
                              style: const TextStyle(color: Colors.white, fontSize: 13.5),
                              decoration: const InputDecoration(
                                labelText: 'Floor',
                                labelStyle: TextStyle(color: Color(0xFF64748B), fontSize: 12),
                                border: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF1E2638))),
                                enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF1E2638))),
                                focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF0284C7))),
                              ),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: TextFormField(
                              controller: _roomController,
                              style: const TextStyle(color: Colors.white, fontSize: 13.5),
                              decoration: const InputDecoration(
                                labelText: 'Room / Hall Number',
                                labelStyle: TextStyle(color: Color(0xFF64748B), fontSize: 12),
                                border: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF1E2638))),
                                enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF1E2638))),
                                focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF0284C7))),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Hardware Info (Manufacturer, Model, Serial)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0D111A),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFF1E2638)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('HARDWARE SPECIFICATIONS (OPTIONAL)', style: TextStyle(color: Color(0xFF64748B), fontWeight: FontWeight.w700, fontSize: 10, letterSpacing: 0.8)),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _manufacturerController,
                              style: const TextStyle(color: Colors.white, fontSize: 13.5),
                              decoration: const InputDecoration(
                                labelText: 'Manufacturer',
                                labelStyle: TextStyle(color: Color(0xFF64748B), fontSize: 12),
                                border: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF1E2638))),
                                enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF1E2638))),
                                focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF0284C7))),
                              ),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: TextFormField(
                              controller: _modelController,
                              style: const TextStyle(color: Colors.white, fontSize: 13.5),
                              decoration: const InputDecoration(
                                labelText: 'Model Number',
                                labelStyle: TextStyle(color: Color(0xFF64748B), fontSize: 12),
                                border: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF1E2638))),
                                enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF1E2638))),
                                focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF0284C7))),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        controller: _serialController,
                        style: const TextStyle(color: Colors.white, fontSize: 13.5),
                        decoration: const InputDecoration(
                          labelText: 'Serial / Inventory Tag',
                          labelStyle: TextStyle(color: Color(0xFF64748B), fontSize: 12),
                          border: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF1E2638))),
                          enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF1E2638))),
                          focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF0284C7))),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Live GPS Location
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0D111A),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFF1E2638)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.location_on_rounded, color: Color(0xFF34D399), size: 20),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('GEOLOCATION PIN', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                            const SizedBox(height: 2),
                            Text(
                              '${_latitude.toStringAsFixed(6)}, ${_longitude.toStringAsFixed(6)}',
                              style: const TextStyle(color: Color(0xFF38BDF8), fontSize: 12.5, fontFamily: 'monospace', fontWeight: FontWeight.w700),
                            ),
                          ],
                        ),
                      ),
                      ElevatedButton.icon(
                        onPressed: _fetchingGps ? null : _fetchCurrentGps,
                        icon: _fetchingGps
                            ? const SizedBox(width: 12, height: 12, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                            : const Icon(Icons.my_location_rounded, size: 14),
                        label: const Text('Fetch GPS', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0284C7),
                          foregroundColor: Colors.white,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Submit Button
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: _isSaving ? null : _saveAsset,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0284C7),
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    child: _isSaving
                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : const Text(
                            'Register Asset & Generate QR Code',
                            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, letterSpacing: -0.2),
                          ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
