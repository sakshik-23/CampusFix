# Flutter and Mobile Scanner ProGuard Rules
-keep class dev.steenbakker.mobile_scanner.** { *; }
-keep interface dev.steenbakker.mobile_scanner.** { *; }
-keep class com.google.mlkit.** { *; }
-keep interface com.google.mlkit.** { *; }
-keep class androidx.camera.** { *; }
-keep interface androidx.camera.** { *; }
-dontwarn dev.steenbakker.mobile_scanner.**
-dontwarn com.google.mlkit.**
-dontwarn androidx.camera.**
