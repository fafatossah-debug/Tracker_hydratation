export interface KotlinFile {
  name: string;
  path: string;
  language: string;
  code: string;
  explanation: string;
}

export const kotlinFiles: KotlinFile[] = [
  {
    name: "HydrationViewModel.kt",
    path: "app/src/main/java/com/example/hydration/ui/HydrationViewModel.kt",
    language: "kotlin",
    explanation: "Gère l'état de l'application via des StateFlow réactifs. Il encapsulate l'état de l'hydratation (quantité actuelle de 1250 ml par défaut pour l'Elegant Dark Theme, objectif de 2L, historique des ajouts) et fournit des fonctions pour modifier cet état de manière sécurisée et unidirectionnelle (UDF).",
    code: `package com.example.hydration.ui

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import java.time.LocalTime
import java.time.format.DateTimeFormatter

// Représente un enregistrement d'ajout d'eau
data class HydrationLog(
    val id: String,
    val amountMl: Int,
    val timeFormatted: String
)

// Représente l'état complet de l'écran d'hydratation
data class HydrationUiState(
    val currentVolumeMl: Int = 1250, // Initialisé à 1250 ml pour correspondre au design Elegant Dark
    val goalVolumeMl: Int = 2000,
    val logs: List<HydrationLog> = listOf(
        HydrationLog("1", 250, "08:15"),
        HydrationLog("2", 500, "09:30"),
        HydrationLog("3", 500, "10:45")
    ),
    val isGoalReached: Boolean = false
)

class HydrationViewModel : ViewModel() {

    // État interne mutable
    private val _uiState = MutableStateFlow(HydrationUiState())
    
    // État externe immuable exposé à l'interface Compose
    val uiState: StateFlow<HydrationUiState> = _uiState.asStateFlow()

    private val timeFormatter = DateTimeFormatter.ofPattern("HH:mm")

    /**
     * Ajoute une quantité d'eau en millilitres
     */
    fun addWater(amountMl: Int) {
        _uiState.update { currentState ->
            val newVolume = (currentState.currentVolumeMl + amountMl).coerceAtMost(5000)
            val goalReached = newVolume >= currentState.goalVolumeMl
            
            val newLog = HydrationLog(
                id = System.currentTimeMillis().toString(),
                amountMl = amountMl,
                timeFormatted = LocalTime.now().format(timeFormatter)
            )

            currentState.copy(
                currentVolumeMl = newVolume,
                logs = listOf(newLog) + currentState.logs,
                isGoalReached = goalReached
            )
        }
    }

    /**
     * Réinitialise le suivi à zéro
     */
    fun resetTracker() {
        _uiState.update { currentState ->
            currentState.copy(
                currentVolumeMl = 0,
                logs = emptyList(),
                isGoalReached = false
            )
        }
    }
}
`
  },
  {
    name: "HydrationScreen.kt",
    path: "app/src/main/java/com/example/hydration/ui/HydrationScreen.kt",
    language: "kotlin",
    explanation: "L'interface utilisateur principale construite avec Jetpack Compose. Utilise un Canvas personnalisé pour dessiner le cercle de progression turquoise brillant #80EFDB et propose des boutons d'action stylisés, une carte de statistiques de progression et un historique de la journée conforme au thème M3 sombre.",
    code: `package com.example.hydration.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HydrationScreen(
    viewModel: HydrationViewModel,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    
    // Pourcentage actuel
    val percentage = ((uiState.currentVolumeMl.toFloat() / uiState.goalVolumeMl.toFloat()) * 100).toInt().coerceAtMost(250)
    val progressFraction = (uiState.currentVolumeMl.toFloat() / uiState.goalVolumeMl.toFloat()).coerceIn(0f, 1f)
    
    // Animation de progression
    val animatedProgress by animateFloatAsState(
        targetValue = progressFraction,
        animationSpec = tween(durationMillis = 800),
        label = "WaterProgress"
    )

    // Portion sélectionnée pour l'ajout
    var selectedQuickAdd by remember { mutableStateOf(250) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .background(Color(0x1A80EFDB), RoundedCornerShape(8.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("💧", fontSize = 16.sp)
                        }
                        Text(
                            text = "Hydratation",
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                    }
                },
                actions = {
                    IconButton(
                        onClick = { viewModel.resetTracker() },
                        colors = IconButtonDefaults.iconButtonColors(
                            contentColor = Color(0xFFFFB4AB)
                        )
                    ) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = "Réinitialiser"
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        },
        bottomBar = {
            // Barre de navigation inférieure simulée
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.background,
                tonalElevation = 0.dp,
                modifier = Modifier.height(72.dp)
            ) {
                NavigationBarItem(
                    selected = true,
                    onClick = { },
                    icon = {
                        Box(
                            modifier = Modifier
                                .size(48.dp, 28.dp)
                                .background(Color(0xFF3E4745), RoundedCornerShape(14.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("💧", fontSize = 14.sp)
                        }
                    },
                    label = { 
                        Text(
                            text = "Aujourd'hui", 
                            fontWeight = FontWeight.Bold,
                            fontSize = 10.sp,
                            color = MaterialTheme.colorScheme.onBackground
                        ) 
                    }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = { },
                    icon = { Text("📊", fontSize = 18.sp, modifier = Modifier.padding(bottom = 2.dp)) },
                    label = { 
                        Text(
                            text = "Historique", 
                            fontSize = 10.sp,
                            color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.5f)
                        ) 
                    }
                )
            }
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 24.dp, vertical = 8.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            
            // 1. Cercle de progression SVG/Canvas
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(200.dp)
                    .padding(8.dp)
            ) {
                val trackColor = Color(0xFF2E3032)
                val primaryColor = MaterialTheme.colorScheme.primary
                
                Canvas(modifier = Modifier.fillMaxSize()) {
                    val strokeWidth = 8.dp.toPx()
                    
                    // Piste d'arrière-plan
                    drawCircle(
                        color = trackColor,
                        style = Stroke(width = strokeWidth)
                    )
                    
                    // Arc turquoise actif
                    drawArc(
                        color = primaryColor,
                        startAngle = -90f,
                        sweepAngle = animatedProgress * 360f,
                        useCenter = false,
                        style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
                    )
                }

                // Texte central
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(
                        verticalAlignment = Alignment.Bottom,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = "\${uiState.currentVolumeMl}",
                            fontSize = 36.sp,
                            fontWeight = FontWeight.Black,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                        Text(
                            text = "ml",
                            fontSize = 14.sp,
                            color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.5f),
                            modifier = Modifier.padding(bottom = 6.dp, start = 2.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "OBJECTIF: \${(uiState.goalVolumeMl / 1000).toFloat()}L",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = primaryColor,
                        letterSpacing = 1.sp
                    )
                }
            }

            // 2. Carte de statistiques rapide (Quick Stats)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF23262B), RoundedCornerShape(24.dp))
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "PROGRES",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.5f),
                        letterSpacing = 0.5.sp
                    )
                    Text(
                        text = "\$percentage%",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                }
                
                Box(
                    modifier = Modifier
                        .height(32.dp)
                        .width(1.dp)
                        .background(Color(0x1AFFFFFF))
                )
                
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .padding(start = 16.dp),
                    horizontalAlignment = Alignment.End
                ) {
                    Text(
                        text = "RESTANT",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.5f),
                        letterSpacing = 0.5.sp
                    )
                    Row(verticalAlignment = Alignment.Bottom) {
                        Text(
                            text = "\${(uiState.goalVolumeMl - uiState.currentVolumeMl).coerceAtLeast(0)}",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                        Text(
                            text = "ml",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.5f),
                            modifier = Modifier.padding(bottom = 2.dp, start = 1.dp)
                        )
                    }
                }
            }

            // Message de félicitations
            AnimatedVisibility(
                visible = uiState.isGoalReached,
                enter = fadeIn() + scaleIn(),
                exit = fadeOut() + scaleOut()
            ) {
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = Color(0x1A80EFDB)
                    ),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Text("✨ ", fontSize = 14.sp)
                        Text(
                            text = "Objectif atteint ! Vous êtes parfaitement hydraté !",
                            color = MaterialTheme.colorScheme.primary,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            }

            // 3. Portion Quick Selectors
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf(150, 250, 500).forEach { volume ->
                        val isSelected = selectedQuickAdd == volume
                        Button(
                            onClick = { selectedQuickAdd = volume },
                            modifier = Modifier
                                .weight(1f)
                                .height(38.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (isSelected) Color(0x2680EFDB) else Color(0xFF1C1B1F),
                                contentColor = if (isSelected) primaryColor else MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
                            ),
                            shape = RoundedCornerShape(12.dp),
                            border = if (isSelected) androidx.compose.foundation.BorderStroke(1.dp, primaryColor) else null
                        ) {
                            Text(text = "\$volume ml", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                // Bouton principal d'ajout
                Button(
                    onClick = { viewModel.addWater(selectedQuickAdd) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp)
                        .shadow(4.dp, RoundedCornerShape(16.dp)),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = primaryColor,
                        contentColor = Color(0xFF111318)
                    ),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text("+", fontSize = 20.sp, fontWeight = FontWeight.Black)
                        Text(
                            text = "Ajouter \$selectedQuickAdd ml",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            // 4. Liste de l'historique
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Text(
                    text = "Aujourd'hui",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.5f)
                )
                
                if (uiState.logs.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .fillMaxHeight()
                            .background(Color(0xFF1C1B1F), RoundedCornerShape(16.dp))
                            .border(1.dp, Color(0x13FFFFFF), RoundedCornerShape(16.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "Aucune boisson",
                            color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.3f),
                            fontSize = 11.sp
                        )
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        items(uiState.logs) { log ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Color(0xFF1C1B1F), RoundedCornerShape(12.dp))
                                    .border(1.dp, Color(0x0AFFFFFF), RoundedCornerShape(12.dp))
                                    .padding(horizontal = 12.dp, vertical = 10.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Text("💧", fontSize = 12.sp)
                                    Text(
                                        text = "Eau ajoutée",
                                        fontWeight = FontWeight.Medium,
                                        fontSize = 11.sp,
                                        color = MaterialTheme.colorScheme.onBackground
                                    )
                                }
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Text(
                                        text = "+\${log.amountMl} ml",
                                        color = primaryColor,
                                        fontWeight = FontWeight.Black,
                                        fontSize = 11.sp
                                    )
                                    Text(
                                        text = log.timeFormatted,
                                        fontSize = 9.sp,
                                        color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.4f)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
`
  },
  {
    name: "Color.kt",
    path: "app/src/main/java/com/example/hydration/ui/theme/Color.kt",
    language: "kotlin",
    explanation: "Définit le jeu de couleurs exactes de notre 'Elegant Dark Theme' : l'éclatant TurquoiseAccent (#80EFDB) issu de la maquette graphique, combiné avec un arrière-plan ultra sombre et moderne.",
    code: `package com.example.hydration.ui.theme

import androidx.compose.ui.graphics.Color

val TurquoiseAccent = Color(0xFF80EFDB)      // L'accent turquoise phare #80EFDB
val TurquoiseSecondary = Color(0xFF00D7C0)   // Dégradé turquoise secondaire #00D7C0
val DarkBackground = Color(0xFF111318)       // Fond Elegant Dark #111318
val DarkSurface = Color(0xFF1A1C1E)          // Surface d'appareil #1A1C1E
val CardSurface = Color(0xFF23262B)          // Surface des cartes de statistiques #23262B
val BorderStrokeColor = Color(0x1AFFFFFF)    // Bordure subtile de 10% blanc

val Purple80 = Color(0xFFD0BCFF)
val PurpleGrey80 = Color(0xFFCCC2DC)
val Pink80 = Color(0xFFEFB8C8)

val Purple40 = Color(0xFF6650a4)
val PurpleGrey40 = Color(0xFF625b71)
val Pink40 = Color(0xFF7D5260)
`
  },
  {
    name: "Theme.kt",
    path: "app/src/main/java/com/example/hydration/ui/theme/Theme.kt",
    language: "kotlin",
    explanation: "Configure et applique la palette de couleurs personnalisée Material 3 pour l'application. Elle associe l'accent turquoise comme couleur primaire et utilise un arrière-plan de surface sombre d'une grande distinction.",
    code: `package com.example.hydration.ui.theme

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
`
  },
  {
    name: "MainActivity.kt",
    path: "app/src/main/java/com/example/hydration/MainActivity.kt",
    language: "kotlin",
    explanation: "Le point d'entrée principal de l'application Android réelle. Elle initialise le HydrationViewModel délégué et monte l'écran principal Compose au sein de notre thème sombre.",
    code: `package com.example.hydration

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.example.hydration.ui.HydrationScreen
import com.example.hydration.ui.HydrationViewModel
import com.example.hydration.ui.theme.HydrationTrackerTheme

class MainActivity : ComponentActivity() {
    
    // Initialisation déléguée du ViewModel
    private val hydrationViewModel: HydrationViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        setContent {
            // Thémage Elegant Dark avec l'accent turquoise #80EFDB
            HydrationTrackerTheme(darkTheme = true) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    HydrationScreen(viewModel = hydrationViewModel)
                }
            }
        }
    }
}
`
  }
];
