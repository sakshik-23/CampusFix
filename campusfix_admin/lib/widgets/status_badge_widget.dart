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
    final String cleanStatus = status.toUpperCase().trim();
    final bool isOpen = cleanStatus == 'OPEN';
    final bool isClosed = cleanStatus == 'CLOSED' || cleanStatus == 'RESOLVED';

    final Color dotColor = isOpen
        ? const Color(0xFFEF4444)
        : (isClosed ? const Color(0xFF10B981) : const Color(0xFFF59E0B));
    final Color textColor = isOpen
        ? const Color(0xFFFCA5A5)
        : (isClosed ? const Color(0xFF6EE7B7) : const Color(0xFFFCD34D));
    final Color bgColor = isOpen
        ? const Color(0x1FEF4444)
        : (isClosed ? const Color(0x1F10B981) : const Color(0x1FF59E0B));
    final Color borderColor = isOpen
        ? const Color(0x3DEF4444)
        : (isClosed ? const Color(0x3D10B981) : const Color(0x3DF59E0B));

    final String displayText = isOpen
        ? 'OPEN'
        : (isClosed ? 'RESOLVED' : cleanStatus);

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: isLarge ? 10.0 : 8.0,
        vertical: isLarge ? 5.0 : 3.0,
      ),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: borderColor, width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            width: isLarge ? 7 : 5,
            height: isLarge ? 7 : 5,
            decoration: BoxDecoration(
              color: dotColor,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: dotColor.withValues(alpha: 0.5),
                  blurRadius: 4,
                  spreadRadius: 1,
                )
              ],
            ),
          ),
          const SizedBox(width: 5),
          Text(
            displayText,
            style: TextStyle(
              color: textColor,
              fontWeight: FontWeight.w700,
              fontSize: isLarge ? 11.5 : 10,
              letterSpacing: 0.6,
            ),
          ),
        ],
      ),
    );
  }
}
