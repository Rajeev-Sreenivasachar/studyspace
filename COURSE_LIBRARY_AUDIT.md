# Middleton Course Library Audit

Audit date: August 24, 2026  
School: Middleton High School, 4801 N 22nd Street, Tampa, Florida 33610

## Availability decision

The official Middleton guidance page was audited before building the library. The latest complete school-specific programming set located there is for **2025-2026**. No complete 2026-2027 Middleton programming set was found, so the application displays 2025-2026 prominently and tells students to confirm registration details with a counselor.

Only courses found on an official Middleton programming sheet or official Middleton pathway table receive `availabilityStatus: "verified-middleton"` and appear in the default library. The data model reserves `hcps-unconfirmed` for district offerings that are not school-verified, but no such entries are shown by default.

School sources:

- [Middleton Guidance](https://www.hillsboroughschools.org/o/middleton/page/guidance)
- [2025-2026 Grades 9 and 10 programming documents](https://www.hillsboroughschools.org/o/middleton/documents/departments/guidance/programming-course-selection-2025-2026-9th-and-10th/810271)
- [2025-2026 Grades 11 and 12 programming documents](https://www.hillsboroughschools.org/o/middleton/documents/departments/guidance/programming-course-selection-2025-2026-11th-and-12th/810272)
- [Middleton magnet-program documents](https://www.hillsboroughschools.org/o/middleton/documents/magnet/magnet-programs/810361)

## Implemented inventory

- 178 school-verified course records
- 14 subject areas
- 20 AP listings
- 9 AICE listings
- 30 magnet-pathway course records
- 772 units
- 3,154 lessons
- 8 previously detailed StudySpace courses preserved with their existing routes and progress keys

Verified records by subject:

| Subject | Courses |
| --- | ---: |
| Biomedical | 6 |
| CTE | 23 |
| Computer Science | 17 |
| Engineering | 9 |
| English | 13 |
| JROTC | 4 |
| Mathematics | 13 |
| Performing Arts | 19 |
| Physical Education | 14 |
| Science | 16 |
| Social Studies | 20 |
| Student Success | 6 |
| Visual Arts | 9 |
| World Languages | 9 |

Verified AP listings: AP Biology; AP Calculus AB; AP Calculus BC; AP Chemistry; AP Computer Science A; AP Computer Science Principles; AP English Literature and Composition; AP Human Geography; AP Macroeconomics; AP Microeconomics; AP Physics (exact title needs confirmation); AP Physics C: Electricity and Magnetism; AP Physics C: Mechanics; AP Precalculus; AP Spanish Language and Culture; AP Spanish Literature and Culture; AP Statistics; AP United States Government and Politics; AP United States History; and AP World History: Modern.

Verified AICE listings: AICE English General Paper AS; AICE English Language AS; AICE Environmental Management AS; AICE Global Perspectives and Research AS; AICE Marine Science AS; AICE Mathematics; AICE Psychology AS; AICE Sport and Physical Education AS; and AICE Thinking Skills.

The verified magnet pathways represented are Biomedical/Biotechnology and Scientific Research, Computer Game Design, Computer Systems: Cyber Security, and PLTW Engineering. AP Physics is retained exactly as the ambiguous school-sheet listing `AP Physics`; StudySpace does not guess which AP Physics course Middleton intended.

## Framework and content policy

School availability and academic content provenance are separate:

1. Middleton/HCPS evidence verifies that the school listed the course.
2. Applicable official public frameworks define what students should learn.
3. Supplied teacher material may override generic sequence and pacing.
4. Original StudySpace material provides explanations, examples, flashcards, quizzes, and practice.

Public framework sources include the [Florida Course Code Directory](https://www.fldoe.org/policy/articulation/ccd/2025-2026-course-directory.stml), [Florida CTE frameworks](https://www.fldoe.org/academics/career-adult-edu/career-tech-edu/program-resources.stml), [College Board AP course pages](https://apcentral.collegeboard.org/courses), [Cambridge AS & A Level subjects](https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-advanced/cambridge-international-as-and-a-levels/subjects/), [PLTW Engineering](https://www.pltw.org/curriculum/pltw-engineering), and [Cisco Networking Academy](https://www.netacad.com/courses).

No paid textbook chapters, AP/AICE past papers, teacher assignments, or copyrighted course packets were copied. Missing teacher details are identified as not supplied instead of being invented.

## Completeness checks

Automated validation requires every verified course to have identity, subject, level, grade, program, source year, source status, credit, prerequisite, and source metadata. It also requires a usable course-to-unit-to-lesson hierarchy. Every generated lesson must include substantive instruction, learning objectives, multiple teaching sections, vocabulary, progressive practice, and an original mastery-check bank.

The current automated result is:

```text
Validated 178 verified Middleton courses, 3154 library lessons, 8 preserved detailed courses, 314 preserved framework lessons, 46 APHG vocabulary entries, 46 APHG questions, 5 Biology sequences, 36 Biology questions, 6 Algebra sections, 24 Algebra cards, and 34 HTML pages.
```

## Known boundaries

- Course offerings, grade placement, prerequisites, credit values, and codes can change after the 2025-2026 sheets. Where Middleton did not state a value clearly, the interface says so.
- A verified offering does not mean a section will run or have space in a future year.
- Teacher-specific pacing, Canvas modules, assigned readings, projects, and grading rules remain separate until actually supplied.
- `AP Physics` needs an exact title before an AP-specific framework can be attached safely.
- The catalog can accept later `verified-middleton` or `hcps-unconfirmed` records without changing saved student mastery or history.
