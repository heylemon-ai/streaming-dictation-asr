# Gemini load test

Each level runs max(2C, 10) sessions with C open at once. No retries.

| Engine | Open at once | Sessions | Failed | Wait p50 | Wait p90 | Max | Connect p50 | Connect p90 | WER | Errors |
|---|---|---|---|---|---|---|---|---|---|---|
| gemini-smart | 1 | 10 | 0 | 535 | 618 | 643 | 781 | 964 | 3.3% | – |
| gemini | 1 | 10 | 0 | 539 | 697 | 725 | 765 | 869 | 7.5% | – |
| gemini-smart | 5 | 10 | 0 | 581 | 616 | 743 | 729 | 791 | 3.3% | – |
| gemini | 5 | 10 | 0 | 622 | 693 | 745 | 668 | 704 | 7.5% | – |
| gemini-smart | 10 | 20 | 0 | 520 | 670 | 691 | 692 | 704 | 4.2% | – |
| gemini | 10 | 20 | 0 | 507 | 679 | 763 | 656 | 701 | 7% | – |
| gemini-smart | 25 | 50 | 0 | 528 | 679 | 815 | 662 | 691 | 3.8% | – |
| gemini | 25 | 50 | 0 | 640 | 908 | 2690 | 742 | 1371 | 6.7% | – |
| gemini-smart | 50 | 100 | 0 | 617 | 1076 | 4618 | 785 | 1557 | 3.7% | – |
| gemini | 50 | 100 | 0 | 579 | 739 | 1466 | 790 | 882 | 6.5% | – |
