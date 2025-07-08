const handleChange = (idx: number, field: string, value: any) => {
  let updatedManual = { ...manualFields[idx], [field]: true }
  if (field === 'unitPrice') {
    updatedManual = { ...updatedManual, vatAmount: false, total: false }
  }
  setManualFields({ ...manualFields, [idx]: updatedManual })
  // ... mevcut kod ...
} 
