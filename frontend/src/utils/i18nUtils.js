import { useTranslation } from 'react-i18next';

/**
 * Utility hook to get localized content from data objects
 * @param {object} content - Content object with language keys (en, hi, pa)
 * @param {string} fallback - Fallback text if no translation found
 * @returns {string} - Localized content
 */
export const useLocalizedContent = (content, fallback = '') => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || 'pa'; // Default to Punjabi
  
  if (!content) return fallback;
  
  // If content is a string, return as-is (backwards compatibility)
  if (typeof content === 'string') return content;
  
  // If content is an object with language keys
  if (typeof content === 'object') {
    return content[currentLanguage] || content['pa'] || content['en'] || content['hi'] || fallback;
  }
  
  return fallback;
};

/**
 * Utility function to get localized content (non-hook version)
 * @param {object} content - Content object with language keys
 * @param {string} language - Current language code
 * @param {string} fallback - Fallback text
 * @returns {string} - Localized content
 */
export const getLocalizedContent = (content, language = 'pa', fallback = '') => {
  if (!content) return fallback;
  
  // If content is a string, return as-is
  if (typeof content === 'string') return content;
  
  // If content is an object with language keys
  if (typeof content === 'object') {
    return content[language] || content['pa'] || content['en'] || content['hi'] || fallback;
  }
  
  return fallback;
};

/**
 * Utility function to format doctor experience with proper localization
 * @param {object|string} experience - Experience content
 * @param {string} language - Current language
 * @returns {string} - Formatted experience text
 */
export const formatExperience = (experience, language = 'pa') => {
  const localizedExp = getLocalizedContent(experience, language);
  
  // Extract number from experience string for consistent formatting
  const years = localizedExp.match(/\d+/)?.[0] || '';
  
  if (language === 'pa') {
    return `${years} ਸਾਲ ਦਾ ਤਜਰਬਾ`;
  } else if (language === 'hi') {
    return `${years} साल का अनुभव`;
  } else {
    return `${years} years experience`;
  }
};

/**
 * Utility function to format consultation fee
 * @param {number} fee - Consultation fee
 * @param {string} language - Current language
 * @returns {string} - Formatted fee text
 */
export const formatConsultationFee = (fee, language = 'pa') => {
  if (fee === 0) {
    if (language === 'pa') {
      return 'ਮੁਫਤ ਸਲਾਹ';
    } else if (language === 'hi') {
      return 'मुफ्त परामर्श';
    } else {
      return 'Free Consultation';
    }
  }
  
  return `₹${fee}`;
};

/**
 * Utility function to get availability status text
 * @param {boolean} available - Availability status
 * @param {string} language - Current language
 * @returns {string} - Availability status text
 */
export const getAvailabilityStatus = (available, language = 'pa') => {
  if (available) {
    if (language === 'pa') {
      return 'ਉਪਲਬਧ';
    } else if (language === 'hi') {
      return 'उपलब्ध';
    } else {
      return 'Available';
    }
  } else {
    if (language === 'pa') {
      return 'ਰੁੱਝਿਆ ਹੋਇਆ';
    } else if (language === 'hi') {
      return 'व्यस्त';
    } else {
      return 'Busy';
    }
  }
};

export default {
  useLocalizedContent,
  getLocalizedContent,
  formatExperience,
  formatConsultationFee,
  getAvailabilityStatus
};