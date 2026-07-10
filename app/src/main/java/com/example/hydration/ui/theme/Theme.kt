package com.example.hydration.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(
    primary = TurquoiseAccent,
    onPrimary = Color(0xFF111318),
    primaryContainer = Color(0xFF1C3B37),
    onPrimaryContainer = TurquoiseAccent,
    secondary = TurquoiseSecondary,
    onSecondary = Color(0xFF111318),
    background = DarkBackground,
    onBackground = Color(0xFFE2E2E6),
    surface = DarkSurface,
    onSurface = Color(0xFFE2E2E6),
    surfaceVariant = CardSurface,
    onSurfaceVariant = Color(0xFFA2A2A6),
    outline = BorderStrokeColor
)

@Composable
fun HydrationTrackerTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    // Dynamic color is available on Android 12+ (but we default to false to force our beautiful turquoise design)
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            dynamicDarkColorScheme(context)
        }
        else -> DarkColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
