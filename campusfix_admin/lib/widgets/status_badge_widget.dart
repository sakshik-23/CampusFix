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
    final bool isOpen = cleanStatus == 'OPEN' || cleanStatus == 'ACTIVE';
    final bool isProgress = cleanStatus == 'IN_PROGRESS' || cleanStatus == 'IN PROGRESS';
    final bool isClosed = cleanStatus == 'CLOSED' || cleanStatus == 'RESOLVED';

    final Color dotColor = isClosed
        ? const Color(0xFF16A34A)
        : (isProgress ? const Color(0xFF0284C7) : const Color(0xFF64748B));
    final Color textColor = isClosed
        ? const Color(0xFF166534)
        : (isProgress ? const Color(0xFF0284C7) : const Color(0xFF334155));
    final Color bgColor = isClosed
        ? const Color(0xFFF0FDF4)
        : (isProgress ? const Color(0xFFEFF6FF) : const Color(0xFFF1F5F9));
    final Color borderColor = isClosed
        ? const Color(0xFF86EFAC)
        : (isProgress ? const Color(0xFFBAE6FD) : const Color(0xFFCBD5E1));

    final String displayText = isClosed
        ? 'RESOLVED'
        : (isProgress ? 'IN PROGRESS' : (isOpen ? 'ACTIVE' : cleanStatus));

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: isLarge ? 10.0 : 8.0,
        vertical: isLarge ? 5.0 : 3.0,
      ),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(999),
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
