use actix_web::{get, HttpResponse};
use serde_json::json;

#[get("/")]
pub async fn index_get() -> HttpResponse {
    let data = json!({
        "name": "icmods-backend",
        "version": env!("CARGO_PKG_VERSION"),
        "documentation": "https://docs.inner-core.org",
        "about": "Welcome traveler!"
    });

    HttpResponse::Ok().json(data)
}
