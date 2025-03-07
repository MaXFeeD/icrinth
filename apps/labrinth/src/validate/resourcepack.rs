use crate::validate::{
    SupportedGameVersions, ValidationError, ValidationResult,
};
use std::io::Cursor;
use zip::ZipArchive;

pub struct ResourcePackValidator;

impl super::Validator for ResourcePackValidator {
    fn get_file_extensions(&self) -> &[&str] {
        &["zip"]
    }

    fn get_supported_loaders(&self) -> &[&str] {
        &["minecraft"]
    }

    fn get_supported_game_versions(&self) -> SupportedGameVersions {
        SupportedGameVersions::All
    }

    fn validate(
        &self,
        archive: &mut ZipArchive<Cursor<bytes::Bytes>>,
    ) -> Result<ValidationResult, ValidationError> {
        if archive.by_name("manifest.json").is_err() {
            return Ok(ValidationResult::Warning(
                "No manifest.json present for resource pack file. Tip: Make sure manifest.json is in the root directory of your resource pack!",
            ));
        }

        Ok(ValidationResult::Pass)
    }
}
