import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'screens/login_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  if (!kIsWeb) {
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.light,
      ),
    );
  }
  runApp(const CampusFixAdminApp());
}

class CampusFixAdminApp extends StatelessWidget {
  const CampusFixAdminApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CampusFix Admin',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0B0F19),
        primaryColor: const Color(0xFF3B82F6),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF3B82F6),
          secondary: Color(0xFF10B981),
          surface: Color(0xFF111827),
          background: Color(0xFF0B0F19),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF111827),
          elevation: 0,
          centerTitle: false,
        ),
      ),
      home: const LoginScreen(),
    );
  }
}
