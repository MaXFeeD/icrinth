use crate::validate::{
    SupportedGameVersions, ValidationError, ValidationResult,
};
use std::io::Cursor;
use zip::ZipArchive;

pub struct InnerCoreValidator;

impl super::Validator for InnerCoreValidator {
    fn get_file_extensions(&self) -> &[&str] {
        &["icpack", "icmod", "zip"]
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
        if archive.by_name("modpack.json").is_err() {
            return Ok(ValidationResult::Warning(
                "No modpack.json present for modpack file.",
            ));
        }

        Ok(ValidationResult::Pass)
    }
}
