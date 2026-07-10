package com.example.hydration

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
