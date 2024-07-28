// import React, { useState, useEffect } from 'react';
// import { z } from 'zod';
// import { Button } from '~/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
// import { Checkbox } from '~/components/ui/checkbox';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
// import { Input } from '~/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
// import { HoverCard, HoverCardContent, HoverCardTrigger } from '~/components/ui/hover-card';
// import { cn } from '~/lib/utils';
// import { productVariantSchema, sizeUnits, weightUnits } from '~/lib/validations/product';
// import countries from '~/lib/countries.json';
// import { toast } from 'sonner';

// const ProductVariantModal = ({ variant, open, onValueChange, onOpenChange, options, productId }) => {
//   const [formData, setFormData] = useState({
//     title: "",
//     price: 0,
//     inventoryQuantity: 0,
//     allowBackorder: false,
//     manageInventory: true,
//     weight: { value: undefined, unit: "kg" },
//     height: { value: undefined, unit: "cm" },
//     length: { value: undefined, unit: "cm" },
//     width: { value: undefined, unit: "cm" },
//     material: "",
//     originCountry: "",
//   });

//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (variant) {
//       setFormData(variant);
//     }
//   }, [variant]);

//   const validateField = (name, value) => {
//     try {
//       productVariantSchema.shape[name].parse(value);
//       setErrors(prev => ({ ...prev, [name]: null }));
//     } catch (error) {
//       setErrors(prev => ({ ...prev, [name]: error.errors[0].message }));
//     }
//   };

//   const handleChange = (name, value) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//     validateField(name, value);
//   };

//   const handleSubmit = () => {
//     try {
//       const validatedData = productVariantSchema.parse(formData);
//       toast.success("Variant created");
//       onValueChange(validatedData);
//       onOpenChange(false);
//     } catch (error) {
//       const newErrors = {};
//       error.errors.forEach(err => {
//         newErrors[err.path[0]] = err.message;
//       });
//       setErrors(newErrors);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="!max-w-screen-sm p-0">
//         <DialogHeader className="p-6 pb-0">
//           <DialogTitle>{variant ? "Edit Variant" : "Add Variant"}</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4 p-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>General</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <label>Title</label>
//                   <Input
//                     value={formData.title}
//                     onChange={(e) => handleChange('title', e.target.value)}
//                     placeholder="Black / XL"
//                   />
//                   {errors.title && <p className="text-red-500">{errors.title}</p>}
//                 </div>
//                 <div>
//                   <label>Material</label>
//                   <Input
//                     value={formData.material}
//                     onChange={(e) => handleChange('material', e.target.value)}
//                     placeholder="100% Cotton"
//                   />
//                   {errors.material && <p className="text-red-500">{errors.material}</p>}
//                 </div>
//                 {/* Add option fields here */}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Inventory Card */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Inventory</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid gap-6">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     checked={formData.manageInventory}
//                     onCheckedChange={(checked) => {
//                       handleChange('manageInventory', checked);
//                       if (!checked) {
//                         handleChange('inventoryQuantity', 0);
//                         handleChange('allowBackorder', false);
//                       }
//                     }}
//                   />
//                   <label>Manage inventory</label>
//                   <HoverCard>
//                     <HoverCardTrigger className={cn("ml-auto size-4 rounded-full text-xs text-muted-foreground")}>
//                       ?
//                     </HoverCardTrigger>
//                     <HoverCardContent className="text-xs">
//                       If checked the inventory will be managed automatically when a order is fulfilled or cancelled.
//                     </HoverCardContent>
//                   </HoverCard>
//                 </div>
//                 {formData.manageInventory && (
//                   <>
//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         checked={formData.allowBackorder}
//                         onCheckedChange={(checked) => handleChange('allowBackorder', checked)}
//                       />
//                       <label>Continue selling when out of stock</label>
//                     </div>
//                     <div>
//                       <label>Quantity</label>
//                       <Input
//                         type="number"
//                         value={formData.inventoryQuantity}
//                         onChange={(e) => handleChange('inventoryQuantity', parseInt(e.target.value))}
//                       />
//                       {errors.inventoryQuantity && <p className="text-red-500">{errors.inventoryQuantity}</p>}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Shipping Card */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Shipping</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid gap-6 sm:grid-cols-2">
//                 {/* Weight */}
//                 <div>
//                   <label>Weight</label>
//                   <div className="flex space-x-2">
//                     <Input
//                       type="number"
//                       value={formData.weight.value || ''}
//                       onChange={(e) => handleChange('weight', { ...formData.weight, value: parseFloat(e.target.value) })}
//                     />
//                     <Select
//                       value={formData.weight.unit}
//                       onValueChange={(value) => handleChange('weight', { ...formData.weight, unit: value })}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Unit" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {Object.values(weightUnits.Values).map((unit) => (
//                           <SelectItem key={unit} value={unit}>{unit}</SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   {errors.weight && <p className="text-red-500">{errors.weight}</p>}
//                 </div>

//                 {/* Height, Length, Width */}
//                 {['height', 'length', 'width'].map((dimension) => (
//                   <div key={dimension}>
//                     <label>{dimension.charAt(0).toUpperCase() + dimension.slice(1)}</label>
//                     <div className="flex space-x-2">
//                       <Input
//                         type="number"
//                         value={formData[dimension].value || ''}
//                         onChange={(e) => handleChange(dimension, { ...formData[dimension], value: parseFloat(e.target.value) })}
//                       />
//                       <Select
//                         value={formData[dimension].unit}
//                         onValueChange={(value) => handleChange(dimension, { ...formData[dimension], unit: value })}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Unit" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {Object.values(sizeUnits.Values).map((unit) => (
//                             <SelectItem key={unit} value={unit}>{unit}</SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     {errors[dimension] && <p className="text-red-500">{errors[dimension]}</p>}
//                   </div>
//                 ))}

//                 {/* Country of Origin */}
//                 <div>
//                   <label>Country of Origin</label>
//                   <Select
//                     value={formData.originCountry}
//                     onValueChange={(value) => handleChange('originCountry', value === 'none' ? undefined : value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a country" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="none">None</SelectItem>
//                       {countries.map(({ name, code }) => (
//                         <SelectItem key={code} value={name}>{name}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {errors.originCountry && <p className="text-red-500">{errors.originCountry}</p>}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//         <div className="border-t py-4 px-6 flex items-center justify-end">
//           <Button onClick={handleSubmit} size="sm">
//             Save
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ProductVariantModal;
