import 'package:flutter/material.dart';

class StatusBadgeWidget extends StatelessWidget {
  final String status;
  final bool isLarge;

  const StatusBadgeWidget({
    Key? key,
    required this.status,
    this.isLarge = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final bool isOpen = status == 'OPEN';
    final Color color = isOpen ? const Color(0xFFEF4444) : const Color(0xFF10B981);
    final Color bgColor = isOpen ? const Color(0x26EF4444) : const Color(0x2610B981);

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: isLarge ? 12.0 : 8.0,
        vertical: isLarge ? 6.0 : 4.0,
      ),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.4)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: isLarge ? 8 : 6,
            height: isLarge ? 8 : 6,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 6),
          Text(
            isOpen ? '🔴 OPEN' : '🟢 CLOSED',
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.w700,
              fontSize: isLarge ? 13 : 11,
              fontFamily: 'monospace',
            ),
          ),
        ],
      ),
    );
  }
}
