import React from 'react'

const createSectionsArray = (number: number) => {

  const sectionsArray = [];
  for (let i = 0; i <= number; i++) {
    sectionsArray.push(i);
  }
  return sectionsArray;
}
interface INumbers {
  page: number, section: number
}

function Section(props: {location: INumbers, sectionId: number, setNumbers: (arr: INumbers) => void}) {
  const { location, sectionId, setNumbers } = props;
  const isSectionOn = (id: number) => {
    const currentSection = location.section;
    return id === currentSection;
  }
  
  return (
    <div onClick={() => setNumbers({page: 0, section: sectionId})} className={isSectionOn(sectionId) 
      ? 'sections__section --active'
      : 'sections__section section-' + sectionId}>{ sectionId + 1 }</div>
  )
}

export { createSectionsArray, Section }