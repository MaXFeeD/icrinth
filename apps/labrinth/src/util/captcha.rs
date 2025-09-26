use crate::routes::ApiError;
use crate::util::ip::get_peer_addr_from_request;
use actix_web::HttpRequest;
use serde::Deserialize;
use std::collections::HashMap;

pub async fn check_hcaptcha(
    req: &HttpRequest,
    challenge: &str,
) -> Result<bool, ApiError> {
    let ip_addr = get_peer_addr_from_request(req).ok_or(ApiError::Turnstile)?;

    let client = reqwest::Client::new();

    #[derive(Deserialize)]
    struct Response {
        success: bool,
    }

    let mut form = HashMap::new();

    let secret = dotenvy::var("HCAPTCHA_SECRET")?;
    form.insert("response", challenge);
    form.insert("secret", &*secret);
    form.insert("remoteip", &ip_addr);

    let val: Response = client
        .post("https://api.hcaptcha.com/siteverify")
        .form(&form)
        .send()
        .await
        .map_err(|_| ApiError::Turnstile)?
        .json()
        .await
        .map_err(|_| ApiError::Turnstile)?;

    Ok(val.success)
}
