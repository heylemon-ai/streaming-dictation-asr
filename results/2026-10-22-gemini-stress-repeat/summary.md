# Gemini load test

Each level runs max(2C, 10) sessions with C open at once. No retries.

| Engine | Open at once | Sessions | Failed | Wait p50 | Wait p90 | Max | Connect p50 | Connect p90 | WER | Errors |
|---|---|---|---|---|---|---|---|---|---|---|
| gemini-smart | 1 | 10 | 0 | 575 | 817 | 864 | 748 | 883 | 3.3% | – |
| gemini | 1 | 10 | 0 | 630 | 679 | 752 | 742 | 799 | 7.5% | – |
| gemini-smart | 5 | 10 | 0 | 591 | 715 | 724 | 701 | 761 | 3.3% | – |
| gemini | 5 | 10 | 0 | 611 | 788 | 912 | 731 | 739 | 7.5% | – |
| gemini-smart | 10 | 20 | 0 | 582 | 935 | 1896 | 727 | 790 | 3.9% | – |
| gemini | 10 | 20 | 0 | 578 | 685 | 1971 | 747 | 815 | 6.9% | – |
| gemini-smart | 25 | 50 | 0 | 594 | 724 | 1370 | 749 | 791 | 3.9% | – |
| gemini | 25 | 50 | 0 | 577 | 715 | 787 | 799 | 827 | 6.6% | – |
| gemini-smart | 50 | 100 | 0 | 697 | 1255 | 3634 | 745 | 2216 | 3.7% | – |
| gemini | 50 | 100 | 0 | 1369 | 3587 | 5207 | 1171 | 4745 | 6.5% | – |
