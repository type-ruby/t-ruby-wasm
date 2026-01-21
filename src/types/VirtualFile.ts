/**
 * Represents a file in the virtual file system
 *
 * @remarks
 * Virtual files are used to manage multi-file T-Ruby projects
 * in the browser environment where there's no real file system.
 *
 * @example
 * ```typescript
 * const file: VirtualFile = {
 *   path: "lib/models/user.trb",
 *   content: "class User\n  attr_reader name: String\nend"
 * };
 * ```
 */
export interface VirtualFile {
  /** File path relative to the project root */
  path: string;

  /** File content as a string */
  content: string;
}
