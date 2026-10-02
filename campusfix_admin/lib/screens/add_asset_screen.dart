import 'package:flutter/material.dart';
import '../models/asset_model.dart';
import '../services/firebase_service.dart';
import '../services/location_service.dart';
import '../theme/app_colors.dart';
import '../constants/campus_constants.dart';
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

  late List<String> _categories;
  late String _selectedCategory;
  String _selectedBuilding = CampusConstants.buildings.first;
  String _selectedFloor = CampusConstants.floors[1]; // "1st Floor"
  String _selectedRoom = CampusConstants.rooms[13]; // "Faculty Room 1"

  double _latitude = 18.520430;
  double _longitude = 73.856744;

  bool _isLoadingId = true;
  bool _isSaving = false;
  bool _fetchingGps = false;

  @override
  void initState() {
    super.initState();
    _categories = CampusConstants.initialItemTypes.map((t) => t['type_name']!).toList();
    _selectedCategory = _categories.first;
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

  void _showDefineNewTypeDialog() {
    final nameCtrl = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.border),
        ),
        title: const Text(
          'Define New Asset Category',
          style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700, fontSize: 16),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Enter category name (e.g. CCTV Camera, Biometric Machine):',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 12.5),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: nameCtrl,
              autofocus: true,
              style: const TextStyle(color: AppColors.textPrimary, fontSize: 13.5),
              decoration: InputDecoration(
                hintText: 'e.g. Smart TV',
                hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 13),
                filled: true,
                fillColor: AppColors.cardSubtle,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.borderLight)),
                enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.borderLight)),
                focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.primary)),
                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel', style: TextStyle(color: AppColors.textSecondary)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () {
              final newType = nameCtrl.text.trim();
              if (newType.isNotEmpty) {
                setState(() {
                  if (!_categories.contains(newType)) {
                    _categories.add(newType);
                  }
                  _selectedCategory = newType;
                });
                Navigator.of(ctx).pop();
              }
            },
            child: const Text('Add Category', style: TextStyle(fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }

  void _showSuccessDialog(CampusAsset asset) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: const BorderSide(color: AppColors.border),
        ),
        content: Padding(
          padding: const EdgeInsets.only(top: 8.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  color: AppColors.success.withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check_rounded, color: AppColors.success, size: 30),
              ),
              const SizedBox(height: 14),
              const Text(
                'Asset Registered Successfully!',
                textAlign: TextAlign.center,
                style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w800, fontSize: 16),
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Assigned ID: ', style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                  Text(
                    asset.itemId,
                    style: const TextStyle(
                      color: AppColors.primary,
                      fontFamily: 'monospace',
                      fontWeight: FontWeight.w800,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.of(ctx).pop();
                    Navigator.of(context).pushReplacement(
                      MaterialPageRoute(builder: (_) => AssetDetailScreen(asset: asset)),
                    );
                  },
                  icon: const Icon(Icons.qr_code_rounded, size: 18),
                  label: const Text('View Asset Details & QR', style: TextStyle(fontWeight: FontWeight.w700)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
              const SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () {
                    Navigator.of(ctx).pop();
                    _nameController.clear();
                    _descController.clear();
                    _initAutoId();
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.textPrimary,
                    side: const BorderSide(color: AppColors.border),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  child: const Text('+ Register Another'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
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
      building: _selectedBuilding,
      floor: _selectedFloor,
      room: _selectedRoom,
      latitude: _latitude,
      longitude: _longitude,
      status: 'ACTIVE',
      qrUrl: qrUrl,
    );

    try {
      await FirebaseService.createAsset(newAsset);
      if (!mounted) return;
      setState(() => _isSaving = false);
      _showSuccessDialog(newAsset);
    } catch (e) {
      if (!mounted) return;
      setState(() => _isSaving = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to save asset: $e'),
          backgroundColor: AppColors.danger,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        iconTheme: const IconThemeData(color: AppColors.textPrimary),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(color: AppColors.border, height: 1),
        ),
        title: const Text(
          'Register New Asset',
          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17, color: AppColors.textPrimary, letterSpacing: -0.3),
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
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      flex: 1,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('ASSET ID', style: TextStyle(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                          const SizedBox(height: 6),
                          TextFormField(
                            controller: _idController,
                            readOnly: true,
                            style: const TextStyle(color: AppColors.primary, fontFamily: 'monospace', fontWeight: FontWeight.w700, fontSize: 13.5),
                            decoration: InputDecoration(
                              filled: true,
                              fillColor: AppColors.surface,
                              suffixIcon: _isLoadingId
                                  ? const SizedBox(
                                      width: 14,
                                      height: 14,
                                      child: Center(
                                        child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary),
                                      ),
                                    )
                                  : null,
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.border)),
                              enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.border)),
                              focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.primary)),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                            ),
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
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('CATEGORY *', style: TextStyle(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                              InkWell(
                                onTap: _showDefineNewTypeDialog,
                                child: const Text(
                                  '+ New',
                                  style: TextStyle(color: AppColors.primary, fontSize: 11, fontWeight: FontWeight.w700),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10),
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: AppColors.border),
                            ),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: _selectedCategory,
                                dropdownColor: AppColors.surface,
                                isExpanded: true,
                                style: const TextStyle(color: AppColors.textPrimary, fontSize: 13.5, fontWeight: FontWeight.w600),
                                items: _categories.map((c) => DropdownMenuItem(value: c, child: Text(c, overflow: TextOverflow.ellipsis))).toList(),
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
                const Text('ITEM / ASSET NAME *', style: TextStyle(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _nameController,
                  style: const TextStyle(color: AppColors.textPrimary, fontSize: 14),
                  decoration: InputDecoration(
                    hintText: 'e.g. Projector #03 or Split AC #01',
                    hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 13),
                    filled: true,
                    fillColor: AppColors.surface,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.border)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.border)),
                    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.primary)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  ),
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'Please enter asset name' : null,
                ),
                const SizedBox(height: 16),

                // Description
                const Text('DESCRIPTION & INSTALLATION NOTES', style: TextStyle(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                const SizedBox(height: 6),
                TextFormField(
                  controller: _descController,
                  maxLines: 2,
                  style: const TextStyle(color: AppColors.textPrimary, fontSize: 13.5),
                  decoration: InputDecoration(
                    hintText: 'e.g. Ceiling mounted in front of whiteboard with VGA/HDMI wall panel.',
                    hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 13),
                    filled: true,
                    fillColor: AppColors.surface,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.border)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.border)),
                    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.primary)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  ),
                ),
                const SizedBox(height: 16),

                // Location Details Hierarchy matching Web Portal
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.border),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.02),
                        blurRadius: 4,
                        offset: const Offset(0, 1),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'PHYSICAL LOCATION HIERARCHY',
                        style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w700, fontSize: 11, letterSpacing: 0.6),
                      ),
                      const SizedBox(height: 12),

                      // Building Dropdown
                      const Text('BUILDING BLOCK *', style: TextStyle(color: AppColors.textSecondary, fontSize: 11, fontWeight: FontWeight.w600)),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        decoration: BoxDecoration(
                          color: AppColors.cardSubtle,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColors.borderLight),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            value: _selectedBuilding,
                            dropdownColor: AppColors.surface,
                            isExpanded: true,
                            style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w600),
                            items: CampusConstants.buildings.map((b) => DropdownMenuItem(value: b, child: Text(b))).toList(),
                            onChanged: (val) {
                              if (val != null) setState(() => _selectedBuilding = val);
                            },
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Floor and Room in a Row
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('FLOOR LEVEL *', style: TextStyle(color: AppColors.textSecondary, fontSize: 11, fontWeight: FontWeight.w600)),
                                const SizedBox(height: 4),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10),
                                  decoration: BoxDecoration(
                                    color: AppColors.cardSubtle,
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(color: AppColors.borderLight),
                                  ),
                                  child: DropdownButtonHideUnderline(
                                    child: DropdownButton<String>(
                                      value: _selectedFloor,
                                      dropdownColor: AppColors.surface,
                                      isExpanded: true,
                                      style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w600),
                                      items: CampusConstants.floors.map((f) => DropdownMenuItem(value: f, child: Text(f))).toList(),
                                      onChanged: (val) {
                                        if (val != null) setState(() => _selectedFloor = val);
                                      },
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('ROOM / LAB CODE *', style: TextStyle(color: AppColors.textSecondary, fontSize: 11, fontWeight: FontWeight.w600)),
                                const SizedBox(height: 4),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10),
                                  decoration: BoxDecoration(
                                    color: AppColors.cardSubtle,
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(color: AppColors.borderLight),
                                  ),
                                  child: DropdownButtonHideUnderline(
                                    child: DropdownButton<String>(
                                      value: _selectedRoom,
                                      dropdownColor: AppColors.surface,
                                      isExpanded: true,
                                      style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w600),
                                      items: CampusConstants.rooms.map((r) => DropdownMenuItem(value: r, child: Text(r, overflow: TextOverflow.ellipsis))).toList(),
                                      onChanged: (val) {
                                        if (val != null) setState(() => _selectedRoom = val);
                                      },
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Live GPS Location
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.border),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.02),
                        blurRadius: 4,
                        offset: const Offset(0, 1),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.success.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.location_on_rounded, color: AppColors.success, size: 20),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('GEOLOCATION PIN', style: TextStyle(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                            const SizedBox(height: 2),
                            Text(
                              '${_latitude.toStringAsFixed(6)}, ${_longitude.toStringAsFixed(6)}',
                              style: const TextStyle(color: AppColors.primary, fontSize: 12.5, fontFamily: 'monospace', fontWeight: FontWeight.w700),
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
                          backgroundColor: AppColors.primary,
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
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    child: _isSaving
                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : const Text(
                            'Register Asset & Generate Unique QR',
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
