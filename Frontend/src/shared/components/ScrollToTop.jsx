import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();
  const selectedCategory = useSelector(state => state.products?.selectedCategory);
  const searchTerm = useSelector(state => state.products?.searchTerm);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname, search, selectedCategory, searchTerm]);

  return null;
}
