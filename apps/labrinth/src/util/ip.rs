use crate::util::env::parse_var;
use actix_web::HttpRequest;
use std::net::{AddrParseError, IpAddr, Ipv6Addr};

pub fn convert_to_ip_v6(src: &str) -> Result<Ipv6Addr, AddrParseError> {
    let ip_addr: IpAddr = src.parse()?;

    Ok(match ip_addr {
        IpAddr::V4(x) => x.to_ipv6_mapped(),
        IpAddr::V6(x) => x,
    })
}

pub fn strip_ip(ip: Ipv6Addr) -> u64 {
    if let Some(ip) = ip.to_ipv4_mapped() {
        let octets = ip.octets();
        u64::from_be_bytes([
            octets[0], octets[1], octets[2], octets[3], 0, 0, 0, 0,
        ])
    } else {
        let octets = ip.octets();
        u64::from_be_bytes([
            octets[0], octets[1], octets[2], octets[3], octets[4], octets[5],
            octets[6], octets[7],
        ])
    }
}

pub fn get_peer_addr_from_request(req: &HttpRequest) -> Option<String> {
    if parse_var("CLOUDFLARE_INTEGRATION").unwrap_or(false) {
        if let Some(header) = req.headers().get("CF-Connecting-IP") {
            return header.to_str().ok().map(|x| x.to_string());
        }
    }

    if let Some(header) = req.headers().get("X-Real-IP") {
        header.to_str().ok().map(|x| x.to_string())
    } else {
        req.connection_info()
            .clone()
            .peer_addr()
            .map(|x| x.to_string())
    }
}
