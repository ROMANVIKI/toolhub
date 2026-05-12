

use tauri::Manager;

// ── Tauri commands (add your backend logic here later) ─────────────────────
//
// Example — call from JS with: invoke('save_tool', { id: 1, condition: 'Worn' })
//
// #[tauri::command]
// fn save_tool(id: u32, condition: String) -> Result<(), String> {
//     println!("Saving tool {id} with condition: {condition}");
//     Ok(())
// }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Centre the main window on startup
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.center();
            }
            Ok(())
        })
        // Register commands:  .invoke_handler(tauri::generate_handler![save_tool])
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

