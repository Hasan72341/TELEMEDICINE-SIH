# Internationalization (i18n) Data Structure Guide

## Overview

The data files have been updated to support multiple languages (Punjabi, Hindi, English) with a structured approach for easy localization management.

## Updated Data Files

### 1. `doctors.json`
- **Before**: Hardcoded English strings
- **After**: Multi-language objects with `en`, `hi`, `pa` keys

```json
{
  "name": {
    "en": "Dr. Rajesh Sharma",
    "hi": "डॉ. राजेश शर्मा", 
    "pa": "ਡਾ. ਰਾਜੇਸ਼ ਸ਼ਰਮਾ"
  }
}
```

### 2. `home.json`
- Updated all text content with language variants
- Features, services, and CTA buttons are localized

### 3. `shop.json` 
- Medicine categories with multilingual names
- Delivery information localized

### 4. `howItWorks.json`
- Step descriptions and CTA content in all languages

## Using Localized Data in Components

### Method 1: Using Utility Hook

```jsx
import { useLocalizedContent } from '../../utils/i18nUtils';

const MyComponent = ({ doctor }) => {
  const localizedName = useLocalizedContent(doctor.name, doctor.name);
  
  return <h3>{localizedName}</h3>;
};
```

### Method 2: Using Utility Function

```jsx
import { getLocalizedContent } from '../../utils/i18nUtils';
import { useTranslation } from 'react-i18next';

const MyComponent = ({ doctor }) => {
  const { i18n } = useTranslation();
  const localizedName = getLocalizedContent(doctor.name, i18n.language);
  
  return <h3>{localizedName}</h3>;
};
```

## Utility Functions Available

### `useLocalizedContent(content, fallback)`
- **Purpose**: React hook to get localized content
- **Parameters**: 
  - `content`: Object with language keys or string
  - `fallback`: Default text if no translation found
- **Returns**: Localized string

### `getLocalizedContent(content, language, fallback)`
- **Purpose**: Non-hook version for utility functions
- **Parameters**:
  - `content`: Object with language keys
  - `language`: Language code (en, hi, pa)
  - `fallback`: Default text

### `formatExperience(experience, language)`
- **Purpose**: Format doctor experience with proper localization
- **Returns**: "15 ਸਾਲ ਦਾ ਤਜਰਬਾ" (Punjabi) or equivalent

### `formatConsultationFee(fee, language)`
- **Purpose**: Format consultation fees with language-specific text
- **Returns**: "ਮੁਫਤ ਸਲਾਹ" for free consultations

### `getAvailabilityStatus(available, language)`
- **Purpose**: Get availability status in current language
- **Returns**: "ਉਪਲਬਧ" / "ਰੁੱਝਿਆ ਹੋਇਆ" etc.

## Language Priority System

1. **Primary**: Current user language (from i18n)
2. **Fallback 1**: Punjabi (`pa`) - Priority language
3. **Fallback 2**: English (`en`) 
4. **Fallback 3**: Hindi (`hi`)
5. **Final**: Provided fallback string

## Best Practices

### 1. Always Provide Fallbacks
```jsx
const title = useLocalizedContent(data.title, 'Default Title');
```

### 2. Consistent Key Structure
```json
{
  "field": {
    "en": "English text",
    "hi": "हिंदी पाठ", 
    "pa": "ਪੰਜਾਬੀ ਪਾਠ"
  }
}
```

### 3. Backwards Compatibility
The utilities handle both old string format and new object format:

```jsx
// Works with both:
const oldFormat = "Simple string";
const newFormat = { en: "English", hi: "हिंदी", pa: "ਪੰਜਾਬੀ" };

useLocalizedContent(oldFormat); // Returns: "Simple string"
useLocalizedContent(newFormat); // Returns: Localized version
```

## Example Implementation

```jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalizedContent } from '../../utils/i18nUtils';
import doctorsData from '../../data/doctors.json';

const DoctorList = () => {
  const { t } = useTranslation();

  return (
    <div className="doctor-list">
      <h2>{t('doctors.title')}</h2>
      
      {doctorsData.doctors.map(doctor => (
        <div key={doctor.id} className="doctor-card">
          <h3>{useLocalizedContent(doctor.name)}</h3>
          <p>{useLocalizedContent(doctor.specialization)}</p>
          <p>{useLocalizedContent(doctor.description)}</p>
          <span>{useLocalizedContent(doctor.experience)}</span>
        </div>
      ))}
    </div>
  );
};
```

## Migration Notes

### For Existing Components:
1. Import the utility functions
2. Replace direct data access with `useLocalizedContent()`
3. Test with all three languages
4. Ensure fallbacks work correctly

### For New Components:
1. Always use the i18n utilities from the start
2. Design with multilingual content in mind
3. Consider text length variations across languages
4. Test RTL compatibility if needed

## Testing Checklist

- [ ] All text displays correctly in Punjabi (default)
- [ ] Language switching works without reload
- [ ] Fallbacks work when translations missing
- [ ] Component layouts handle longer/shorter text
- [ ] Special characters display properly (ਪੰਜਾਬੀ, हिंदी)
- [ ] Numbers and dates format correctly per locale

This system ensures your telemedicine platform provides a seamless multilingual experience with Punjabi as the priority language, while maintaining backwards compatibility and easy maintenance.