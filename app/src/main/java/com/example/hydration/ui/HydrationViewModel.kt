package com.example.hydration.ui

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
