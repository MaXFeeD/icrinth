use crate::{models::ids::ProjectId, routes::ApiError};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ReturnIntervals {
    pub time: u32,
    pub id: u64,
    pub total: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ReturnCountry {
    pub country: String,
    pub id: u64,
    pub total: u64,
}

// Fetches playtimes as a Vec of ReturnPlaytimes
pub async fn fetch_playtimes(
    projects: Vec<ProjectId>,
    start_date: DateTime<Utc>,
    end_date: DateTime<Utc>,
    resolution_minute: u32,
    pool: &PgPool,
) -> Result<Vec<ReturnIntervals>, ApiError> {
    let interval_seconds = resolution_minute * 60;
    let project_ids: Vec<i64> = projects.iter().map(|x| x.0 as i64).collect();

    let results = sqlx::query!(
        r#"
        SELECT
            (EXTRACT(epoch FROM recorded)::int / $1) * $1 as time,
            project_id as id,
            COALESCE(SUM(seconds)::BIGINT, 0) as total
        FROM analytics_playtime
        WHERE recorded BETWEEN $2 AND $3
            AND project_id = ANY($4)
        GROUP BY (EXTRACT(epoch FROM recorded)::int / $1), project_id
        ORDER BY time, project_id
        "#,
        interval_seconds as i64,
        start_date,
        end_date,
        &project_ids
    )
    .fetch_all(pool)
    .await?;

    Ok(results
        .into_iter()
        .map(|r| ReturnIntervals {
            time: r.time.unwrap_or(0) as u32,
            id: r.id as u64,
            total: r.total.unwrap_or(0) as u64,
        })
        .collect())
}

// Fetches views as a Vec of ReturnViews
pub async fn fetch_views(
    projects: Vec<ProjectId>,
    start_date: DateTime<Utc>,
    end_date: DateTime<Utc>,
    resolution_minutes: u32,
    pool: &PgPool,
) -> Result<Vec<ReturnIntervals>, ApiError> {
    let interval_seconds = resolution_minutes * 60;
    let project_ids: Vec<i64> = projects.iter().map(|x| x.0 as i64).collect();

    let results = sqlx::query!(
        r#"
        SELECT
            (EXTRACT(epoch FROM recorded)::int / $1) * $1 as time,
            project_id as id,
            COUNT(*) as total
        FROM analytics_views
        WHERE recorded BETWEEN $2 AND $3
            AND project_id = ANY($4)
        GROUP BY (EXTRACT(epoch FROM recorded)::int / $1), project_id
        ORDER BY time, project_id
        "#,
        interval_seconds as i64,
        start_date,
        end_date,
        &project_ids
    )
    .fetch_all(pool)
    .await?;

    Ok(results
        .into_iter()
        .map(|r| ReturnIntervals {
            time: r.time.unwrap_or(0) as u32,
            id: r.id as u64,
            total: r.total.unwrap_or(0) as u64,
        })
        .collect())
}

// Fetches downloads as a Vec of ReturnDownloads
pub async fn fetch_downloads(
    projects: Vec<ProjectId>,
    start_date: DateTime<Utc>,
    end_date: DateTime<Utc>,
    resolution_minutes: u32,
    pool: &PgPool,
) -> Result<Vec<ReturnIntervals>, ApiError> {
    let interval_seconds = resolution_minutes * 60;
    let project_ids: Vec<i64> = projects.iter().map(|x| x.0 as i64).collect();

    let results = sqlx::query!(
        r#"
        SELECT
            (EXTRACT(epoch FROM recorded)::int / $1) * $1 as time,
            project_id as id,
            COUNT(*) as total
        FROM analytics_downloads
        WHERE recorded BETWEEN $2 AND $3
            AND project_id = ANY($4)
        GROUP BY (EXTRACT(epoch FROM recorded)::int / $1), project_id
        ORDER BY time, project_id
        "#,
        interval_seconds as i64,
        start_date,
        end_date,
        &project_ids
    )
    .fetch_all(pool)
    .await?;

    Ok(results
        .into_iter()
        .map(|r| ReturnIntervals {
            time: r.time.unwrap_or(0) as u32,
            id: r.id as u64,
            total: r.total.unwrap_or(0) as u64,
        })
        .collect())
}

pub async fn fetch_countries_downloads(
    projects: Vec<ProjectId>,
    start_date: DateTime<Utc>,
    end_date: DateTime<Utc>,
    pool: &PgPool,
) -> Result<Vec<ReturnCountry>, ApiError> {
    let project_ids: Vec<i64> = projects.iter().map(|x| x.0 as i64).collect();

    let results = sqlx::query!(
        r#"
        SELECT
            country,
            project_id,
            COUNT(*) as total
        FROM analytics_downloads
        WHERE recorded BETWEEN $1 AND $2 
            AND project_id = ANY($3)
            AND country IS NOT NULL
        GROUP BY country, project_id
        ORDER BY total DESC
        "#,
        start_date,
        end_date,
        &project_ids
    )
    .fetch_all(pool)
    .await?;

    Ok(results
        .into_iter()
        .map(|r| ReturnCountry {
            country: r
                .country
                .expect("Unexpected country state in analytics query"),
            id: r.project_id as u64,
            total: r.total.unwrap_or(0) as u64,
        })
        .collect())
}

pub async fn fetch_countries_views(
    projects: Vec<ProjectId>,
    start_date: DateTime<Utc>,
    end_date: DateTime<Utc>,
    pool: &PgPool,
) -> Result<Vec<ReturnCountry>, ApiError> {
    let project_ids: Vec<i64> = projects.iter().map(|x| x.0 as i64).collect();

    let results = sqlx::query!(
        r#"
        SELECT
            country,
            project_id,
            COUNT(*) as total
        FROM analytics_views
        WHERE recorded BETWEEN $1 AND $2 
            AND project_id = ANY($3)
            AND country IS NOT NULL
        GROUP BY country, project_id
        ORDER BY total DESC
        "#,
        start_date,
        end_date,
        &project_ids
    )
    .fetch_all(pool)
    .await?;

    Ok(results
        .into_iter()
        .map(|r| ReturnCountry {
            country: r
                .country
                .expect("Unexpected country state in analytics query"),
            id: r.project_id as u64,
            total: r.total.unwrap_or(0) as u64,
        })
        .collect())
}
