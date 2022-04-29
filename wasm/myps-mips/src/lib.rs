mod utils;

use itertools::join;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

use mips::{Mips, OptimizationConfig};

extern crate web_sys;

macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[wasm_bindgen]
pub fn optimize_mips(
    source: String,
    optimize_registers: bool,
    remove_comments: bool,
    remove_empty: bool,
    remove_empty_comments: bool,
    replace_alias_reg: bool,
    replace_alias_dev: bool,
    replace_defines: bool,
    replace_tags: bool,
) -> String {
    let mut mips = mips::Mips::lex_source(&source).unwrap();

    let config = OptimizationConfig {
        optimize_registers,
        remove_comments,
        remove_empty,
        remove_empty_comments,
        remove_reg_aliases: replace_alias_reg,
        remove_dev_aliases: replace_alias_dev,
        remove_defines: replace_defines,
        remove_tags: replace_tags,
    };

    let optimized = mips.optimize(config).unwrap();
    let output = join(optimized.lines.into_iter(), "\n");

    output
}

#[wasm_bindgen]
pub fn translate_myps(
    source: String,
    optimize_registers: bool,
    remove_comments: bool,
    remove_empty: bool,
    remove_empty_comments: bool,
    replace_alias_reg: bool,
    replace_alias_dev: bool,
    replace_defines: bool,
    replace_tags: bool,
) -> String {
    let program_item = myps::lexer::lex_string(source).unwrap();
    let mut translator = translator::Translator::default();
    let lines = translator.translate_item(program_item).unwrap();

    let config = OptimizationConfig {
        optimize_registers,
        remove_comments,
        remove_empty,
        remove_empty_comments,
        remove_reg_aliases: replace_alias_reg,
        remove_dev_aliases: replace_alias_dev,
        remove_defines: replace_defines,
        remove_tags: replace_tags,
    };

    let optimized = Mips::default_with_lines(lines)
        .unwrap()
        .optimize(config)
        .unwrap();
    join(optimized.lines.into_iter(), "\n")
}
