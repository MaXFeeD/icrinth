use crate::validate::{
    SupportedGameVersions, ValidationError, ValidationResult,
};
use std::io::Cursor;
use zip::ZipArchive;

pub struct NoJavaContentValidator;

impl super::Validator for NoJavaContentValidator {
    fn get_file_extensions(&self) -> &[&str] {
        &["jar", "litemod", "zip"]
    }

    fn get_supported_loaders(&self) -> &[&str] {
        &[]
    }

    fn get_supported_game_versions(&self) -> SupportedGameVersions {
        SupportedGameVersions::All
    }

    fn validate(
        &self,
        archive: &mut ZipArchive<Cursor<bytes::Bytes>>,
    ) -> Result<ValidationResult, ValidationError> {
        if archive.by_name("fabric.mod.json").is_ok() {
            return Ok(ValidationResult::Warning(
                "We also enjoy Fabric, but it is not Modrinth; please upload any mods written for Inner Core.",
            ));
        }

        if archive.by_name("mcmod.info").is_ok()
            || archive.by_name("META-INF/mods.toml").is_ok()
            || archive.by_name("META-INF/neoforge.mods.toml").is_ok()
        {
            return Ok(ValidationResult::Warning(
				"Forge/Neoforge is extremely common, but it is not Modrinth; please upload any mods written for Inner Core."
			));
        }

        if archive.by_name("litemod.json").is_ok() {
            return Ok(ValidationResult::Warning(
				"LiteLoader is extremely undemanding, but it is not Modrinth; please upload any mods written for Inner Core."
			));
        }

        if archive.by_name("quilt.mod.json").is_ok() {
            return Ok(ValidationResult::Warning(
				"Quilt is quite flexible and has an extensive community, but it is not Modrinth; please upload any mods written for Inner Core."
			));
        }

        if archive.by_name("riftmod.json").is_ok() {
            return Ok(ValidationResult::Warning(
				"Rift is a decent option for creating mods, but it is not Modrinth; please upload the mod written for Inner Core."
			));
        }

        Ok(ValidationResult::Warning(
            "Use an alternative site to upload content for another game.",
        ))
    }
}
