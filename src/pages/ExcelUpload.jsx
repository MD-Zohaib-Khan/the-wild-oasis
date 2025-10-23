// // ExcelUpload.jsx
// import { useState } from "react";
// import * as XLSX from "xlsx";
// import supabase from "../services/supabase";


// //Splits a large array into smaller pieces to prevent exceeding req limit
// function chunkArray(arr, size) {
//   const out = [];
//   for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
//   return out;
// }

// export default function ExcelUpload() {
//   const [fileName, setFileName] = useState("");
//   const [rows, setRows] = useState([]);
//   const [preview, setPreview] = useState([]);
//   const [errors, setErrors] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState({ done: 0, total: 0 });

//   const handleFileSelect = async (e) => {
//     setErrors([]);
//     const f = e.target.files?.[0];
//     if (!f) return;
//     setFileName(f.name);

//     const buffer = await f.arrayBuffer();
//     const wb = XLSX.read(buffer, { type: "array" });
//     const sheet = wb.Sheets[wb.SheetNames[0]];
//     const raw = XLSX.utils.sheet_to_json(sheet, { defval: null }); // array of objects

//     // Normalize headers: convert keys to snake_case lower trimmed
//     const normalized = raw.map((r) => {
//       const out = {};
//       Object.entries(r).forEach(([k, v]) => {
//         const key = k.toString().trim().toLowerCase().replace(/\s+/g, "_");
//         out[key] = v;
//       });
//       return out;
//     });

//     setRows(normalized);
//     setPreview(normalized.slice(0, 10));
//   };

//   // Example validation - adjust fields
//   const validateAll = (arr) => {
//     const errs = [];
//     arr.forEach((r, idx) => {
//       if (!r.name) errs.push({ row: idx + 1, field: "name", msg: "Missing name" });
//       if (!r.rollno) errs.push({ row: idx + 1, field: "roll_no", msg: "Missing rollno" });
//       if (r.email && !/^\S+@\S+\.\S+$/.test(String(r.email))) {
//         errs.push({ row: idx + 1, field: "email", msg: "Invalid email" });
//       }
//     });
//     return errs;
//   };

//   const transform = (r) => ({
//     name: r.name || null,
//     rollno: r.rollno ? String(r.rollno) : null,
//     email: r.email || null,
//     department: r.department || null,
//     semester: r.semester || null
//   });

//   const insertToDB = async () => {
//     setErrors([]);
//     if (!rows.length) {
//       alert("No rows parsed.");
//       return;
//     }

//     const v = validateAll(rows);
//     if (v.length) {
//       setErrors(v);
//       return;
//     }

//     const dbRows = rows.map(transform);
//     const batches = chunkArray(dbRows, 500); // tune batch size

//     setUploading(true);
//     setProgress({ done: 0, total: dbRows.length });

//     try {
//       let inserted = 0;
//       for (const batch of batches) {
//         const { error } = await supabase.from("students").insert(batch);
//         if (error) {
//           console.error("Insert error:", error);
//           throw error;
//         }
//         inserted += batch.length;
//         setProgress({ done: inserted, total: dbRows.length });
//       }
//       alert(`Inserted ${inserted} rows.`);
//       setRows([]);
//       setPreview([]);
//     } catch (err) {
//       alert("Insert failed — check console for details.");
//       console.error(err);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div>
//       <h3>Upload Excel/CSV</h3>
//       <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileSelect} />
//       {fileName && <p>Selected: {fileName}</p>}

//       {preview.length > 0 && (
//         <>
//           <h4>Preview (first {preview.length})</h4>
//           <pre style={{ maxHeight: 200, overflow: "auto" }}>
//             {JSON.stringify(preview, null, 2)}
//           </pre>
//           <button onClick={insertToDB} disabled={uploading}>
//             {uploading ? `Uploading ${progress.done}/${progress.total}` : "Insert to DB"}
//           </button>
//         </>
//       )}

//       {errors.length > 0 && (
//         <>
//           <h4>Validation errors</h4>
//           <ul>{errors.map((e, i) => <li key={i}>Row {e.row}: {e.field} — {e.msg}</li>)}</ul>
//         </>
//       )}
//     </div>
//   );
// }
