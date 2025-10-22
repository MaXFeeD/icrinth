use crate::validate::{
    SupportedGameVersions, ValidationError, ValidationResult,
};
use std::io::Cursor;
use zip::ZipArchive;

pub struct CoreEngineValidator;

impl super::Validator for CoreEngineValidator {
    fn get_file_extensions(&self) -> &[&str] {
        &["icmod", "zip"]
    }

    fn get_supported_loaders(&self) -> &[&str] {
        &["coreengine"]
    }

    fn get_supported_game_versions(&self) -> SupportedGameVersions {
        SupportedGameVersions::All
    }

    fn validate(
        &self,
        archive: &mut ZipArchive<Cursor<bytes::Bytes>>,
    ) -> Result<ValidationResult, ValidationError> {
        if archive.by_name("build.config").is_err()
            && !archive.file_names().any(|x| x.ends_with("/build.config"))
        {
            return Ok(ValidationResult::Warning(
                "No build.config present for mod file.",
            ));
        }

        Ok(ValidationResult::Pass)
    }
}
