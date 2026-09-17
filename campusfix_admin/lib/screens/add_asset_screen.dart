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
  String _selectedStatus = 'ACTIVE';
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
    final qrUrl = 'https://campusfix-360dd.web.app/report/$assetId';

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
      status: _selectedStatus,
      qrUrl: qrUrl,
    );

    try {
      await FirebaseService.createAsset(newAsset);
      if (!mounted) return;
      setState(() => _isSaving = false);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Asset $assetId registered successfully! 🎉'),
          backgroundColor: const Color(0xFF10B981),
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
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B0F19),
      appBar: AppBar(
        backgroundColor: const Color(0xFF111827),
        elevation: 0,
        title: const Text('Register New Asset', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
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
                          const Text('Asset ID', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 6),
                          TextFormField(
                            controller: _idController,
                            style: const TextStyle(color: Color(0xFF60A5FA), fontFamily: 'monospace', fontWeight: FontWeight.bold),
                            decoration: InputDecoration(
                              filled: true,
                              fillColor: const Color(0xFF111827),
                              suffixIcon: _isLoadingId
                                  ? const SizedBox(
                                      width: 14,
                                      height: 14,
                                      child: Center(
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2,
                                          color: Color(0xFF38BDF8),
                                        ),
                                      ),
                                    )
                                  : null,
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF1E293B))),
                              enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF1E293B))),
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
                          const Text('Category', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            decoration: BoxDecoration(
                              color: const Color(0xFF111827),
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: const Color(0xFF1E293B)),
                            ),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: _selectedCategory,
                                dropdownColor: const Color(0xFF111827),
                                isExpanded: true,
                                style: const TextStyle(color: Colors.white, fontSize: 14),
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
                const Text('Asset Name *', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _nameController,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'e.g. Epson Ceiling Projector #02',
                    hintStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 13),
                    filled: true,
                    fillColor: const Color(0xFF111827),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF1E293B))),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF1E293B))),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  ),
                  validator: (v) => (v == null || v.isEmpty) ? 'Please enter asset name' : null,
                ),
                const SizedBox(height: 16),

                // Description
                const Text('Description', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _descController,
                  maxLines: 2,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'e.g. HDMI projector connected to main instructor lectern.',
                    hintStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 13),
                    filled: true,
                    fillColor: const Color(0xFF111827),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF1E293B))),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF1E293B))),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  ),
                ),
                const SizedBox(height: 16),

                // Location Details (Building, Floor, Room)
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFF111827),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF1E293B)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Campus Location', style: TextStyle(color: Color(0xFF38BDF8), fontWeight: FontWeight.bold, fontSize: 13)),
                      const SizedBox(height: 10),
                      TextFormField(
                        controller: _buildingController,
                        style: const TextStyle(color: Colors.white),
                        decoration: const InputDecoration(
                          labelText: 'Building Name',
                          labelStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                          border: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF334155))),
                        ),
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _floorController,
                              style: const TextStyle(color: Colors.white),
                              decoration: const InputDecoration(
                                labelText: 'Floor',
                                labelStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                                border: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF334155))),
                              ),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: TextFormField(
                              controller: _roomController,
                              style: const TextStyle(color: Colors.white),
                              decoration: const InputDecoration(
                                labelText: 'Room / Hall Number',
                                labelStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                                border: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF334155))),
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
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFF111827),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF1E293B)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Hardware Specifications (Optional)', style: TextStyle(color: Color(0xFF38BDF8), fontWeight: FontWeight.bold, fontSize: 13)),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _manufacturerController,
                              style: const TextStyle(color: Colors.white),
                              decoration: const InputDecoration(
                                labelText: 'Manufacturer',
                                labelStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                                border: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF334155))),
                              ),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: TextFormField(
                              controller: _modelController,
                              style: const TextStyle(color: Colors.white),
                              decoration: const InputDecoration(
                                labelText: 'Model Number',
                                labelStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                                border: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF334155))),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        controller: _serialController,
                        style: const TextStyle(color: Colors.white),
                        decoration: const InputDecoration(
                          labelText: 'Serial Number / Tag',
                          labelStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                          border: UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF334155))),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Live GPS Location
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFF111827),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF1E293B)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.location_on, color: Color(0xFF10B981), size: 24),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('On-Site GPS Pin', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                            Text(
                              '${_latitude.toStringAsFixed(6)}, ${_longitude.toStringAsFixed(6)}',
                              style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12, fontFamily: 'monospace'),
                            ),
                          ],
                        ),
                      ),
                      TextButton.icon(
                        onPressed: _fetchingGps ? null : _fetchCurrentGps,
                        icon: _fetchingGps
                            ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF3B82F6)))
                            : const Icon(Icons.my_location, size: 16, color: Color(0xFF3B82F6)),
                        label: const Text('Update GPS', style: TextStyle(color: Color(0xFF3B82F6), fontSize: 12)),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Submit Button
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton.icon(
                    onPressed: _isSaving ? null : _saveAsset,
                    icon: _isSaving
                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : const Icon(Icons.add_task_rounded, color: Colors.white),
                    label: Text(
                      _isSaving ? 'Registering to Cloud...' : 'Register Asset & Generate QR',
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF3B82F6),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
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
